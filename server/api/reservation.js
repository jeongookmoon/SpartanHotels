var express = require('express');
var router = express.Router({mergeParams: true});
const passport = require('../auth.js')
var Queries = require('../queries')
var mysql = require('mysql')

const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyParser = require('body-parser')

var validator = require('validator');

const dateChecker = require("./_checks")

const TAX_RATE = 10
const CANCELLATION_CHARGE_RATE = 20


//Make a reservation 
router.post('/', (req, res)=>{

    async function makeRes(requestedBooking={}){

        let checkPassed = false

        checkPassed = await availabilityAndPriceCheck(requestedBooking, res)
        if(!checkPassed){
            return
        }

        checkPassed = await multipleBookingCheck(requestedBooking, res)
        if(!checkPassed){
            return
        }



    

        

        let insertBookingQuery;
        if (requestedBooking.user){
            // if user is member
            
            // check if user has enough rewards if user used rewards
            checkPassed = await sufficientRewardsCheck(requestedBooking, res)
            if(!checkPassed){
                return
            }

            if(requestedBooking.rewards_applied > requestedBooking.total_price){
                res.status(400).send(`Rewards applied ${requestedBooking.rewards_applied} is more than ${requestedBooking.total_price}`)
                return
            }

            // check that total_price = amount_paid + rewards_applied
            // TODO: reward conversion rate
            if( requestedBooking.total_price != requestedBooking.amount_paid + requestedBooking.rewards_applied){
                res.status(400).send(`Amount due ${requestedBooking.total_price} doesnt match ${requestedBooking.amount_paid + requestedBooking.rewards_applied}`)
                return
            }
            // make query to insert as user
            insertBookingQuery = mysql.format(Queries.booking.book, [requestedBooking.user, null, req.body.room_id, req.body.total_price, req.body.cancellation_charge, req.body.date_in, req.body.date_out, "booked", req.body.amount_paid])
        }
        else{   // is guest
            // check that total_price = amount_paid
            // TODO: reward conversion rate
            if( requestedBooking.total_price != requestedBooking.amount_paid){
                res.status(400).send(`Amount due ${requestedBooking.total_price} doesnt match ${requestedBooking.amount_paid}`)
                return
            }

            // Insert guest into guest table
            let insertGuestQuery = mysql.format(Queries.guest.insert, [requestedBooking.guest_email, requestedBooking.guest_name])
            let insertGuestResult = await Queries.run(insertGuestQuery)
            let guestID = insertGuestResult.insertId
            // make query to insert as guest
            insertBookingQuery = mysql.format(Queries.booking.book, [null, guestID, req.body.room_id, req.body.total_price, req.body.cancellation_charge, req.body.date_in, req.body.date_out, "booked", req.body.amount_paid])
        }
        console.log(insertBookingQuery)


        // Check if payment valid?


        // Make booking
        let insertResult;
        try{
            insertResult = await Queries.run(insertBookingQuery)
        } catch(error){
            res.status(400).send(error)
            return
        }
        console.log(insertResult)
        let bookingID = insertResult.insertId

        if(! requestedBooking.user){
            res.status(200).send({message:`created booking #${bookingID}`, data: bookingID})
        }
        else{
            // update rewards applied
            if( requestedBooking.rewards_applied > 0){
                let rewardAppliedQuery = mysql.format(Queries.rewards.useOnBooking,[requestedBooking.user, bookingID, (-1) * requestedBooking.rewards_applied])
                let rewardAppliedResult;
                try{
                    rewardAppliedResult = await Queries.run(rewardAppliedQuery)
                } catch(error){
                    res.status(400).send(error)
                    return
                }
            }
            
            // update rewards gained from this booking
            let rewardsGained = parseInt(requestedBooking.amount_paid * 0.10)

            let rewardGainedQuery = mysql.format(Queries.rewards.gainFromBooking,[requestedBooking.user, bookingID, requestedBooking.date_out,rewardsGained])
            let rewardGainedResult;
            try{
                rewardGainedResult = await Queries.run(rewardGainedQuery)
            } catch(error){
                res.status(400).send(error)
                return
            }

            res.status(200).send({message:`created booking #${bookingID}`, data: bookingID})
        }
        
    }

    // Check values
    console.log(req.body);

    if (! dateChecker(req.body, res)){
        return
    }
    

    let requestedBooking = {}
    requestedBooking.room_id = req.body.room_id
    requestedBooking.date_in = req.body.date_in
    requestedBooking.date_out = req.body.date_out
    requestedBooking.total_price = req.body.total_price
    requestedBooking.cancellation_charge = req.body.cancellation_charge
    if(req.user){
        requestedBooking.user = req.user.user_id
    }
    else{
        // is guest
        requestedBooking.user = null
        requestedBooking.guest_email = req.body.guest_email ? req.body.guest_email : ''
        requestedBooking.guest_name = req.body.guest_name ? req.body.guest_name : "GUEST"

        if (  typeof(requestedBooking.guest_email) == 'undefined' || !validator.isEmail(requestedBooking.guest_email)){
            res.status(400).send("Invalid email")
            return
        }
    }
    
    if( typeof(req.body.amount_paid) == 'undefined' || !validator.isFloat(req.body.amount_paid + '')){
        res.status(400).send("Invalid amount_paid")
            return
    }

    requestedBooking.amount_paid = parseFloat(req.body.amount_paid)
    requestedBooking.rewards_applied = req.body.rewards_applied ? parseInt(req.body.rewards_applied) : 0

    console.log(req.user)

    makeRes(requestedBooking)

})

// TODO: Update to v0.2; rewards
router.post('/cancellation', (req,res)=>{
    // TODO: check for user id to match the booking
    console.log(req.body);
    let query = mysql.format(Queries.booking.cancel, [req.body.booking_id]);
    console.log(query)

    Queries.run(query).then(
        results =>{
            res.status(200).send(results)
        },
        error =>{
            res.status(400).send(error)
        }
    )
})

// TODO: Update to v0.2
router.post('/modification', (req,res)=>{
    // TODO: check for user id to match the booking
    console.log(req.body);
    let query = mysql.format(Queries.booking.modify, [req.body.room_id, req.body.date_in, req.body.date_out, req.body.booking_id]);
    console.log(query)

    Queries.run(query).then(
        results =>{
            res.status(200).send(results)
        },
        error =>{
            res.status(400).send(error)
        }
    )
})


router.post('/check', (req,res)=>{
    // Check values
    console.log(req.body);
    
    if (! dateChecker(req.body, res)){
        return
    }

    let query = Queries.booking.isBookable(req.body)

    Queries.run(query)
    .then(
        results =>{
            console.log(results)
            let bookable = results[0].available;
            console.log(bookable)
            
            if(bookable){
                console.log(true)
                res.status(200).send("This room is bookable during the selected timespan")
            }
            else{
                res.status(200).send("This room is not bookable during the selected timespan")
            }
        }
    )
    .catch(
        error =>{
            console.log(error)
            res.status(400).send("bad")
        }
    )


})

async function multipleBookingCheck(requestedBooking,res){
            // Check for multiple booking under same id
            if (requestedBooking.user){
                console.log("checking for multiple bookings for user")
                let query = Queries.booking.duplicateBookingCheck({
                    user_id: requestedBooking.user,
                    date_in: requestedBooking.date_in,
                    date_out: requestedBooking.date_out
                })
                console.log(query)
                let queryResults;
                try{
                    queryResults = await Queries.run(query)
                } catch(e){
                    // query failed for some reason
                    console.log(e)
                    res.status(400).send("bad")
                    return false
                }
                console.log(queryResults)
                let isMultipleBooking = (Array.isArray(queryResults) && queryResults.length) ? true : false
    
                if(isMultipleBooking){
                    console.log("multiple booking")
                    res.status(400).send("This room is not bookable during the selected timespan due to multiple booking")   
                    return false
                }
            }
            return true
}
async function availabilityAndPriceCheck(requestedBooking, res){
    // Check if this booking is possible
    let query = Queries.booking.isBookable(requestedBooking)
    let bookingAvailableResults;
    try{
        bookingAvailableResults = await Queries.run(query)
    } catch(e){
        // query failed for some reason
        console.log(e)
        res.status(400).send("bad")
        return false
    }
    console.log(bookingAvailableResults)
    let bookable = bookingAvailableResults[0].available;
        
    if(! bookable){
        console.log(false)
        res.status(400).send("This room is not bookable during the selected timespan")   
        return false
    }
        // check client-submitted pricing is correct
        const nights_stayed = ((new Date(requestedBooking.date_out) - new Date(requestedBooking.date_in))/(24*60*60*1000))
        console.log(nights_stayed)
            // check total price
        let total_price = (bookingAvailableResults[0].price * nights_stayed * (1 + (TAX_RATE/100))).toFixed(2)
        total_price = parseFloat(total_price)
        console.log(total_price)
        console.log(requestedBooking.total_price)
        if ( requestedBooking.total_price != total_price){
            res.status(400).send("Total price does not match price on server")   
            return false
        }
            // check cancellation charge
        let cancellation_charge = (bookingAvailableResults[0].price * nights_stayed * (CANCELLATION_CHARGE_RATE/100)).toFixed(2)
        cancellation_charge = parseFloat(cancellation_charge)
        console.log(cancellation_charge)
        if (requestedBooking.cancellation_charge != cancellation_charge){
            res.status(400).send("Cancellation charge does not match server")   
            return false
        }

    return true
}

// This is only for users not guests
async function sufficientRewardsCheck(requestedBooking,res){
    // check if user has enough rewards if user used rewards
    if( requestedBooking.rewards_applied > 0){
        let rewardQuery = mysql.format(Queries.user.getAvailableRewards, [requestedBooking.user])
        console.log(`query is ${rewardQuery}`)

        try{
            queryResults = await Queries.run(rewardQuery)
        } catch(e){
            // query failed for some reason
            console.log(e)
            res.status(400).send("bad")
            return false
        }
        let availableRewards = queryResults[0].sum
        console.log(`availableRewards is ${availableRewards}`)
        if(availableRewards < requestedBooking.rewards_applied){
            res.status(400).send("User doesn't have enough reward points")
            return false
        }
    }
    return true
}
module.exports = router;