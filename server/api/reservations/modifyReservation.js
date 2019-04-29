const { bookingConflictWithAnotherHotelCheck } = require("./bookingConflictWithAnotherHotelCheck");
const { modifyAvailabilityCheck, totalPriceAndCancellationChargeCheck } = require("./availabilityAndPriceCheck");
const { paymentCheckOnModify } = require("./paymentCheckOnModify");
const { TAX_RATE, CANCELLATION_CHARGE_RATE } = require("./rates");

var Queries = require('../../queries')
var mysql = require('mysql')
var Email = require('../email.js')
const pug = require('pug')

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
    availableRequestedRooms.map( x=>{ x.room_ids = x.room_ids.split(",").map(y=> Number(y))})
    console.log(availableRequestedRooms)

    // check client-submitted total_price, cancellation_charge
    checkResults = await totalPriceAndCancellationChargeCheck(requestedBooking, res)
    if( ! checkResults.pass){
        return
    }

    let checkPassed = false


    checkPassed = await bookingConflictWithAnotherHotelCheck(requestedBooking, res)
    if (!checkPassed) {
        return
    }

    let { checkFailed: checkResult, oldTransactionData, amountDueFromUser } = await paymentCheckOnModify(requestedBooking, transaction_id, res)
    checkPassed = !checkResult
    if (!checkPassed) {
        return
    }
    console.log(oldTransactionData)

    let final_cancellation_charge = (oldTransactionData.cancellation_charge > requestedBooking.cancellation_charge) ? oldTransactionData.cancellation_charge : requestedBooking.cancellation_charge

    console.log(`amountduefromuser ${amountDueFromUser}`)
    console.log(`oldTransactionData ${oldTransactionData}`)
    console.log(`oldTransactionData cancellation charge ${oldTransactionData.cancellation_charge}`)
    console.log(`cancellation_charge ${final_cancellation_charge}`)


    // issue refund or take payment? or check if stripe transaction valid ?


    // query to remove old transaction_room data
    let removeOldTRDataQuery;
    // query to insert new transaction_room data
    let insertNewTRDataQuery;
    // query to update transaction table
    let updateTransactionTableQuery
    // query to remove old reward data
    let removeOldRewardDataQuery;
    // query to insert reward data
    let insertNewRewardsAppliedDataQuery;
    let insertNewRewardsGainedDataQuery;

    let queryToRemoveOldTRDataAndOldRewardData = mysql.format(Queries.modify.removeTransactionRoomDataAndRewardsForTransaction, transaction_id)
    console.log(`queryToRemoveOldTRDataAndOldRewardData ${queryToRemoveOldTRDataAndOldRewardData}`)

    if (requestedBooking.rewards_applied > 0) {
        insertNewRewardsAppliedDataQuery = mysql.format(Queries.rewards.useOnBooking, [requestedBooking.user, transaction_id, (-1) * requestedBooking.rewards_applied])
    }

    // update rewards gained from this booking
    let rewardsGained = parseInt(requestedBooking.amount_paid * 0.10)
    insertNewRewardsGainedDataQuery = mysql.format(Queries.rewards.gainFromBooking, [requestedBooking.user, transaction_id, requestedBooking.date_out, rewardsGained])

    insertNewTRDataQuery = Queries.booking.makeTransactionDetails(transaction_id, requestedBooking.rooms)

    updateTransactionTableQuery = mysql.format(Queries.modify.updateTransaction,
        [requestedBooking.total_price,
            final_cancellation_charge,
        requestedBooking.date_in,
        requestedBooking.date_out,
            "booked",
        requestedBooking.amount_paid,
            null,
            transaction_id
        ])

    let connection = Queries.connection

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

    })
}

exports.modifyReservation = modifyReservation