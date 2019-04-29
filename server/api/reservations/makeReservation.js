const { paymentCheck } = require("./paymentCheck");
const { bookingConflictWithAnotherHotelCheck } = require("./bookingConflictWithAnotherHotelCheck");
const { availabilityCheck, totalPriceAndCancellationChargeCheck } = require("./availabilityAndPriceCheck");
const { getUserEmail } = require("./getUserEmail");
const { REWARD_RATE } = require("./rates");
var Queries = require('../../queries')
var mysql = require('mysql')
var Email = require('../email.js')
const pug = require('pug')

async function makeReservation(requestedBooking = {}, res) {
    console.log(requestedBooking)

    // check requested rooms are available
    let checkResult = await availabilityCheck(requestedBooking,res)
    if( ! checkResult.pass){
        return 
    }
    let availableRequestedRooms = checkResult.availableRequestedRooms
    availableRequestedRooms.map( x=>{ x.room_ids = x.room_ids.split(",")})
    console.log(availableRequestedRooms)



    // check client-submitted total_price, cancellation_charge
    checkResult = await totalPriceAndCancellationChargeCheck(requestedBooking, res)
    if( ! checkResult.pass){
        return 
    }

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

    if (requestedBooking.user) {
        // make query to insert as user
        insertTransactionQuery = mysql.format(Queries.booking.makeTransaction, [requestedBooking.user, null, requestedBooking.total_price, requestedBooking.cancellation_charge, requestedBooking.date_in, requestedBooking.date_out, "booked", requestedBooking.amount_due_from_user, requestedBooking.stripe_id])

    }
    else {   // is guest
        // Insert guest into guest table
        let insertGuestQuery = mysql.format(Queries.guest.insert, [requestedBooking.guest_email, requestedBooking.guest_name])
        let insertGuestResult = await Queries.run(insertGuestQuery)
        let guestID = insertGuestResult.insertId
        // make query to insert as guest
        insertTransactionQuery = mysql.format(Queries.booking.makeTransaction, [null, guestID, requestedBooking.total_price, requestedBooking.cancellation_charge, requestedBooking.date_in, requestedBooking.date_out, "booked", requestedBooking.amount_due_from_user, requestedBooking.stripe_id])
    }
    console.log(insertTransactionQuery)


    // Check if stripe payment valid?


    // Make booking

    // insert transaction
    let insertResult;
    try {
        insertResult = await Queries.run(insertTransactionQuery)
    } catch (error) {
        res.status(400).send(error)
        return
    }
    console.log(insertResult)
    let transactionID = insertResult.insertId

    // insert transaction rooms
    insertTransactionRoomDataQuery = mysql.format(Queries.booking.makeTransactionDetails(transactionID, availableRequestedRooms))
    console.log(`hello ${insertTransactionRoomDataQuery}`)

    try {
        await Queries.run(insertTransactionRoomDataQuery)
    } catch (error) {
        res.status(400).send(error)
        return
    }



    if (!requestedBooking.user) {
        res.status(200).send({ message: `created transaction #${transactionID}`, data: transactionID })
    }
    else {
        // update rewards applied
        if (requestedBooking.rewards_applied > 0) {
            let rewardAppliedQuery = mysql.format(Queries.rewards.useOnBooking, [requestedBooking.user, transactionID, (-1) * requestedBooking.rewards_applied])
            let rewardAppliedResult;
            try {
                rewardAppliedResult = await Queries.run(rewardAppliedQuery)
            } catch (error) {
                res.status(400).send(error)
                return
            }
        }

        // update rewards gained from this booking
        let rewardsGained = parseInt(requestedBooking.amount_due_from_user * (REWARD_RATE/100) * 100)

        let rewardGainedQuery = mysql.format(Queries.rewards.gainFromBooking, [requestedBooking.user, transactionID, requestedBooking.date_out, rewardsGained])
        let rewardGainedResult;
        try {
            rewardGainedResult = await Queries.run(rewardGainedQuery)
        } catch (error) {
            res.status(400).send(error)
            return
        }


        res.status(200).send({ message: `created transaction #${transactionID}`, data: transactionID })

    }
    //Send order confirmation email
    var emailParams = {};
    let email = getUserEmail(requestedBooking.user)
    console.log(email)
    email.then(function (results) {
        emailParams.to = results
        console.log('Email being set to: ' + results)
        emailParams.subject = 'Your Spartan Hotels Order Confirmation!'
        // emailParams.text = 'Hello. Thank you for booking a reservation using Spartan Hotels. This is an email to confirm you order for: \n' + JSON.stringify(requestedBooking);
        var emailContents = pug.renderFile("./email_templates/makeReservation.pug", { "transaction_number": transactionID, "date": new Date().toLocaleDateString() })
        emailParams.html = emailContents
        var email = Email.email(emailParams)
    })
}

exports.makeReservation = makeReservation