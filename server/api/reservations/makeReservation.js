const { paymentCheck } = require("./paymentCheck");
const { bookingConflictWithAnotherHotelCheck } = require("./bookingConflictWithAnotherHotelCheck");
const { availability_SameHotel_AndPriceCheck } = require("./availabilityAndPriceCheck");
const { getUserEmail } = require("./getUserEmail");
var Queries = require('../../queries')
var mysql = require('mysql')
var Email = require('../email.js')
const pug = require('pug')

async function makeReservation(requestedBooking = {}, res) {

    let checkPassed = false

    checkPassed = await availability_SameHotel_AndPriceCheck(requestedBooking, res)
    if (!checkPassed) {
        return
    }

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
        insertTransactionQuery = mysql.format(Queries.booking.makeTransaction, [requestedBooking.user, null, req.body.total_price, req.body.cancellation_charge, req.body.date_in, req.body.date_out, "booked", req.body.amount_paid, req.stripe_id])

    }
    else {   // is guest
        // Insert guest into guest table
        let insertGuestQuery = mysql.format(Queries.guest.insert, [requestedBooking.guest_email, requestedBooking.guest_name])
        let insertGuestResult = await Queries.run(insertGuestQuery)
        let guestID = insertGuestResult.insertId
        // make query to insert as guest
        insertTransactionQuery = mysql.format(Queries.booking.makeTransaction, [null, guestID, req.body.total_price, req.body.cancellation_charge, req.body.date_in, req.body.date_out, "booked", req.body.amount_paid, req.stripe_id])
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
    insertTransactionRoomDataQuery = mysql.format(Queries.booking.makeTransactionDetails(transactionID, requestedBooking.rooms))
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
        let rewardsGained = parseInt(requestedBooking.amount_paid * 0.10)

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