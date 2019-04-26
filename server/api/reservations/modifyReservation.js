const { bookingConflictWithAnotherHotelCheck } = require("./bookingConflictWithAnotherHotelCheck");
const { modify_Availability_SameHotel_AndPriceCheck } = require("./availabilityAndPriceCheck");
const { paymentCheckOnModify } = require("./paymentCheckOnModify");


var Queries = require('../../queries')
var mysql = require('mysql')
var Email = require('../email.js')
const pug = require('pug')

async function modifyReservation(requestedBooking = {}, transaction_id, res) {
    let checkPassed = false

    checkPassed = await modify_Availability_SameHotel_AndPriceCheck(requestedBooking, transaction_id, res)
    if (!checkPassed) {
        return
    }
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