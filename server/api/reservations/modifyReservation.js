const { bookingConflictWithAnotherHotelCheck } = require("./bookingConflictWithAnotherHotelCheck");
const { modifyAvailabilityCheck, totalPriceAndCancellationChargeCheck } = require("./availabilityAndPriceCheck");
const { paymentCheckOnModify } = require("./paymentCheckOnModify");
const { TAX_RATE, REWARD_RATE } = require("./rates");

var Queries = require('../../queries')
var mysql = require('mysql')
var Email = require('../email.js')
const pug = require('pug')
const { getUserEmail } = require("./getUserEmail");
const compiledPugModifyResEmail = pug.compileFile("./email_templates/modifyReservation.pug");
const bodyParser  = require('body-parser');
const stripe = require("stripe")("sk_test_KMjoJvcxhuiJSV51GJcaJfSi00r9QtVXjo"); // Your Stripe key

/**
 * 
 * @param {Object} requestedBooking 
 * @param {Number} requestedBooking.total_price
 * @param {Number} requestedBooking.cancellation_charge  
 * @param {Date} requestedBooking.date_in
 * @param {Date} requestedBooking.date_out
 * @param {Number} requestedBooking.rewards_applied
 * @param {[Room]} requestedBooking.rooms
 * @param {Number} requestedBooking.hotel_id
 * @param {Number} requestedBooking.transaction_id
 * @param {Number} requestedBooking.amount_due_from_user The difference that the user has to pay from their old booking to their new booking
 * @param {Number} transaction_id 
 * @param {Express.Response} res 
 */
async function modifyReservation(requestedBooking, transaction_id, res) {
    console.log("modifying res")
    let checkResults = await modifyAvailabilityCheck(requestedBooking, transaction_id, res)

    if( ! checkResults.pass){
        console.log("failed availability check")
        return 
    }
    let availableRequestedRooms = checkResults.availableRequestedRooms
    console.log(`\n\n ${JSON.stringify(availableRequestedRooms)} \n\n`)
    console.log( (typeof(availableRequestedRooms[0].room_ids)))
    var test  = "hey,hey"
    test = test.split(",")
    //console.log(test.split(","));
    console.log("test after:"+test)
    for (i=0;i<availableRequestedRooms.length-1; i++){
        availableRequestedRooms[i].room_ids =  availableRequestedRooms[i].room_ids.split(",")

        for (x=0;x<availableRequestedRooms[i].room_ids.length-1; x++){

            availableRequestedRooms[i].room_ids[x] =  Number(availableRequestedRooms[i].room_ids[x])
        }
    }
    // availableRequestedRooms.map( x=>{ console.log( typeof(x.room_ids) +"\n"+x.room_ids ); x.room_ids = x.room_ids.split(",")})
    

    console.log(availableRequestedRooms)

    // check client-submitted total_price, cancellation_charge
    checkResults = await totalPriceAndCancellationChargeCheck(requestedBooking, res)
    if( ! checkResults.pass){
        return
    }

    let totalRoomPricePerNight = checkResults.totalRoomPricePerNight
    let nights_stayed = checkResults.nights_stayed

    let checkPassed = false


    checkPassed = await bookingConflictWithAnotherHotelCheck(requestedBooking, res)
    if (!checkPassed) {
        return
    }

    let { checkFailed: checkResult, oldTransactionData, amountDueFromUser: additionalAmountDueFromUser } = await paymentCheckOnModify(requestedBooking, transaction_id, res)
    checkPassed = !checkResult
    if (!checkPassed) {
        return
    }
    console.log(oldTransactionData)

    let final_cancellation_charge = (oldTransactionData.cancellation_charge > requestedBooking.cancellation_charge) ? oldTransactionData.cancellation_charge : requestedBooking.cancellation_charge

    console.log(`additionalAmountDueFromUser ${additionalAmountDueFromUser}`)
    console.log(`oldTransactionData ${oldTransactionData}`)
    console.log(`oldTransactionData cancellation charge ${oldTransactionData.cancellation_charge}`)
    console.log(`cancellation_charge ${final_cancellation_charge}`)

    // issue refund or take payment? or check if stripe transaction valid ?


    let emailAddress
    if( ! requestedBooking.user){
        emailAddress = requestedBooking.guest_email
    }
    else{
        emailAddress = await getUserEmail(requestedBooking.user)
    }

    // query to insert new transaction_room data
    let insertNewTRDataQuery;
    // query to update transaction table
    let updateTransactionTableQuery

    // query to insert reward data
    let insertNewRewardsAppliedDataQuery;
    let insertNewRewardsGainedDataQuery;

    // query to remove old transaction_room data and old reward data
    let queryToRemoveOldTRDataAndOldRewardData = mysql.format(Queries.modify.removeTransactionRoomDataAndRewardsForTransaction, transaction_id)
    console.log(`queryToRemoveOldTRDataAndOldRewardData ${queryToRemoveOldTRDataAndOldRewardData}`)

    if (requestedBooking.rewards_applied > 0) {
        insertNewRewardsAppliedDataQuery = mysql.format(Queries.rewards.useOnBooking, [requestedBooking.user, transaction_id, (-1) * requestedBooking.rewards_applied])
    }

    let applied_reward_cash_value = requestedBooking.rewards_applied / 100

    let amountCashPaid = requestedBooking.total_price - applied_reward_cash_value 
    console.log(amountCashPaid)
    
    // update rewards gained from this booking
    let rewardsGained = parseInt(amountCashPaid * (REWARD_RATE/100) * 100)
    insertNewRewardsGainedDataQuery = mysql.format(Queries.rewards.gainFromBooking, [requestedBooking.user, transaction_id, requestedBooking.date_out, rewardsGained])

    insertNewTRDataQuery = Queries.booking.makeTransactionDetails(transaction_id, availableRequestedRooms)
    console.log(insertNewTRDataQuery)
    
    let amount_user_paid = requestedBooking.total_price - (requestedBooking.rewards_applied/100)

    updateTransactionTableQuery = mysql.format(Queries.modify.updateTransaction,
        [requestedBooking.total_price,
            final_cancellation_charge,
        requestedBooking.date_in,
        requestedBooking.date_out,
            "booked",
            amount_user_paid,
            requestedBooking.stripe_id,
            transaction_id
        ])

    let connection = Queries.connection

    
    if (oldTransactionData.amount_paid > 0.5){
        // make refund
    stripe.refunds.create({
        charge: oldTransactionData.stripe_id,

    }, err => {
        console.log(err)
    })
    }    
    





    connection.beginTransaction(async function (err) {
        if (err) { throw err; }

        try {
            if (typeof (queryToRemoveOldTRDataAndOldRewardData) != "undefined") {
                try {
                    await Queries.run(queryToRemoveOldTRDataAndOldRewardData)
                } catch (error) {
                    // query failed for some reason
                    console.log(error)
                    throw error;
                }
            }

            if (typeof (insertNewRewardsAppliedDataQuery) != "undefined") {
                try {
                    await Queries.run(insertNewRewardsAppliedDataQuery)
                } catch (error) {
                    // query failed for some reason
                    console.log(error)
                    throw error;
                }
            }

            if (typeof (insertNewRewardsGainedDataQuery) != "undefined") {
                try {
                    await Queries.run(insertNewRewardsGainedDataQuery)
                } catch (error) {
                    // query failed for some reason
                    console.log(error)
                    throw error;
                }
            }


            if (typeof (insertNewTRDataQuery) != "undefined") {
                try {
                    await Queries.run(insertNewTRDataQuery)
                } catch (error) {
                    // query failed for some reason
                    console.log(error)
                    throw error;
                }
            }


            if (typeof (updateTransactionTableQuery) != "undefined") {
                try {
                    await Queries.run(updateTransactionTableQuery)
                } catch (error) {
                    // query failed for some reason
                    console.log(error)
                    throw error;
                }
            }


            connection.commit(function (err) {
                if (err) {
                    throw err;
                }
                console.log('success!');
                res.status(200).send("Transaction succeeded!")
            });
        }
        catch (error) {
            console.log(error)
            connection.rollback()
            res.status(400).send("update transaction failed")
        }

        // send email
        var emailParams = {};
        console.log(emailAddress)

        let hotelInfo = await Queries.run( Queries.email.getHotelInfo(requestedBooking.hotel_id))
        console.log(hotelInfo)
        
        emailParams.to = emailAddress
        console.log('Email being sent to: ' + emailAddress)
        emailParams.subject = 'Your Spartan Hotels Booking Has Been Modified!'
        // emailParams.text = 'Hello. Thank you for booking a reservation using Spartan Hotels. This is an email to confirm you order for: \n' + JSON.stringify(requestedBooking);
        var emailContents = compiledPugModifyResEmail({ "transaction_number": transaction_id, "date": new Date().toLocaleDateString(),
        "availableRequestedRooms": availableRequestedRooms, "requestedBooking":requestedBooking, "hotelInfo":hotelInfo[0],
        "totalRoomPricePerNight":totalRoomPricePerNight, "numberOfNightsStayed":nights_stayed
    })
        emailParams.html = emailContents
        var email = Email.email(emailParams)

    })
    
}

exports.modifyReservation = modifyReservation