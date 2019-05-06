const { paymentCheck } = require("./paymentCheck");
const { bookingConflictWithAnotherHotelCheck } = require("./bookingConflictWithAnotherHotelCheck");
const { availabilityCheck, totalPriceAndCancellationChargeCheck } = require("./availabilityAndPriceCheck");
const { getUserEmail } = require("./getUserEmail");
const { REWARD_RATE } = require("./rates");
var Queries = require('../../queries')
var mysql = require('mysql')
var Email = require('../email.js')
const pug = require('pug')
const compiledPugMakeResEmail = pug.compileFile("./email_templates/makeReservation.pug");

async function makeReservation(requestedBooking = {}, res) {
    console.log(requestedBooking)

    // check requested rooms are available
    let checkResult = await availabilityCheck(requestedBooking,res)
    if( ! checkResult.pass){
        return 
    }
    let availableRequestedRooms = checkResult.availableRequestedRooms
    availableRequestedRooms.map( x=>{ x.room_ids = x.room_ids.split(",")})
    console.log("availableRequestedRooms")
    console.log(availableRequestedRooms)
    console.log("end availableRequestedRooms")


    // check client-submitted total_price, cancellation_charge
    checkResult = await totalPriceAndCancellationChargeCheck(requestedBooking, res)
    if( ! checkResult.pass){
        return 
    }
    let totalRoomPricePerNight = checkResult.totalRoomPricePerNight
    let nights_stayed = checkResult.nights_stayed

    let checkPassed = false

    checkPassed = await bookingConflictWithAnotherHotelCheck(requestedBooking, res)
    if (!checkPassed) {
        return
    }

    let insertTransactionQuery; // store query to insert into transaction table
    let insertTransactionRoomDataQuery; // store query to insert into transaction_room table

    checkPassed = await paymentCheck(requestedBooking, res)
    if (!checkPassed) {
        return
    }

    let insertGuestQuery
    if (requestedBooking.user) {
        // make query to insert as user
        insertTransactionQuery = mysql.format(Queries.booking.makeTransaction, [requestedBooking.user, null, requestedBooking.total_price, requestedBooking.cancellation_charge, requestedBooking.date_in, requestedBooking.date_out, "booked", requestedBooking.amount_due_from_user, requestedBooking.stripe_id])

    }
    else {   // is guest
        // Insert guest into guest table
        insertGuestQuery = mysql.format(Queries.guest.insert, [requestedBooking.guest_email, requestedBooking.guest_name])
    }
    console.log(insertTransactionQuery)


    // Check if stripe payment valid?

    let emailAddress
    if( ! requestedBooking.user){
        emailAddress = requestedBooking.guest_email
    }
    else{
        emailAddress = await getUserEmail(requestedBooking.user)
    }
    
    let connection = Queries.connection
    // make transaction

    let transactionID
    connection.beginTransaction(async function (err) {
        if (err) { throw err; }
         
        try{
            // insert guest
            if(! requestedBooking.user){
                try {
                    let insertGuestResult = await Queries.run(insertGuestQuery)
                    let guestID = insertGuestResult.insertId
                    // make query to insert as guest
                    insertTransactionQuery = mysql.format(Queries.booking.makeTransaction, [null, guestID, requestedBooking.total_price, requestedBooking.cancellation_charge, requestedBooking.date_in, requestedBooking.date_out, "booked", requestedBooking.amount_due_from_user, requestedBooking.stripe_id])
                } catch (error) {
                    console.log(error)
                    throw error
                } 
            }

            // Make booking

            // insert transaction
            let insertResult;
            try {
                insertResult = await Queries.run(insertTransactionQuery)
            } catch (error) {
                console.log(error)
                throw error
            }
            console.log(insertResult)
            transactionID = insertResult.insertId

            // insert transaction rooms
            insertTransactionRoomDataQuery = mysql.format(Queries.booking.makeTransactionDetails(transactionID, availableRequestedRooms))
            console.log(`insertTransactionRoomDataQuery\n  ${insertTransactionRoomDataQuery}`)
            try {
                await Queries.run(insertTransactionRoomDataQuery)
            } catch (error) {
                console.log(error)
                throw error
            }

            if (requestedBooking.user) {
                // update rewards applied
                if (requestedBooking.rewards_applied > 0) {
                    let rewardAppliedQuery = mysql.format(Queries.rewards.useOnBooking, [requestedBooking.user, transactionID, (-1) * requestedBooking.rewards_applied])
                    let rewardAppliedResult;
                    try {
                        rewardAppliedResult = await Queries.run(rewardAppliedQuery)
                    } catch (error) {
                        console.log(error)
                        throw error
                    }
                }

                // update rewards gained from this booking
                let rewardsGained = parseInt(requestedBooking.amount_due_from_user * (REWARD_RATE/100) * 100)

                let rewardGainedQuery = mysql.format(Queries.rewards.gainFromBooking, [requestedBooking.user, transactionID, requestedBooking.date_out, rewardsGained])
                let rewardGainedResult;
                try {
                    rewardGainedResult = await Queries.run(rewardGainedQuery)
                } catch (error) {
                    console.log(error)
                    throw error
                } 
            }


            connection.commit(function (err) {
                if (err) {
                    throw err;
                }
                console.log('success!');
                res.status(200).send({ message: `created transaction #${transactionID}`, data: transactionID })
            });                
        }
        catch (error){
            console.log(error)
            connection.rollback()
            res.status(400).send("update transaction failed")
        }

        //Send order confirmation email
        var emailParams = {};
        console.log(emailAddress)

        let hotelInfo = await Queries.run( Queries.email.getHotelInfo(requestedBooking.hotel_id))
        console.log(hotelInfo)
        
        emailParams.to = emailAddress
        console.log('Email being sent to: ' + emailAddress)
        emailParams.subject = 'Your Spartan Hotels Booking Confirmation!'
        console.log(JSON.stringify(requestedBooking))
        // emailParams.text = 'Hello. Thank you for booking a reservation using Spartan Hotels. This is an email to confirm you order for: \n' + JSON.stringify(requestedBooking);
        var emailContents = compiledPugMakeResEmail({ "transaction_number": transactionID, "date": new Date().toLocaleDateString(),
        "availableRequestedRooms": availableRequestedRooms, "requestedBooking":requestedBooking, "hotelInfo":hotelInfo[0],
        "totalRoomPricePerNight":totalRoomPricePerNight, "numberOfNightsStayed":nights_stayed
    })
        emailParams.html = emailContents
        var email = Email.email(emailParams)
    })
}

exports.makeReservation = makeReservation