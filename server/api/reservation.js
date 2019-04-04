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


//Make a reservation 
router.post('/', (req, res)=>{

    async function makeRes(requestedBooking={}){
        // Check if this booking is possible
        let query = Queries.booking.isBookable(requestedBooking)
        let bookingAvailableResults;
        try{
            bookingAvailableResults = await Queries.run(query)
        } catch(e){
            // query failed for some reason
            console.log(e)
            res.status(400).send("bad")
            return
        }
        console.log(bookingAvailableResults)
        let bookable = bookingAvailableResults[0].available;
            
        if(! bookable){
            console.log(false)
            res.status(400).send("This room is not bookable during the selected timespan")   
            return
        }
        // else is bookable


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
                return
            }
            console.log(queryResults)
            let isMultipleBooking = (Array.isArray(queryResults) && queryResults.length) ? true : false

            if(isMultipleBooking){
                console.log("multiple booking")
                res.status(400).send("This room is not bookable during the selected timespan due to multiple booking")   
                return
            }
        }



        
        // check client-submitted pricing is correct
        const TAX_RATE = 10
        const CANCELLATION_CHARGE_RATE = 20

        const nights_stayed = ((new Date(requestedBooking.date_out) - new Date(requestedBooking.date_in))/(24*60*60*1000))
        console.log(nights_stayed)
            // check total price
        let total_price = (bookingAvailableResults[0].price * nights_stayed * (1 + (TAX_RATE/100))).toFixed(2)
        total_price = parseFloat(total_price)
        console.log(total_price)
        console.log(requestedBooking.total_price)
        if ( requestedBooking.total_price != total_price){
            res.status(400).send("Total price does not match price on server")   
            return
        }
            // check cancellation charge
        let cancellation_charge = (bookingAvailableResults[0].price * nights_stayed * (CANCELLATION_CHARGE_RATE/100)).toFixed(2)
        cancellation_charge = parseFloat(cancellation_charge)
        console.log(cancellation_charge)
        if (requestedBooking.cancellation_charge != cancellation_charge){
            res.status(400).send("Cancellation charge does not match server")   
            return
        }
        
        let insertQuery;
        if (requestedBooking.user){
            // if user is member
                // get user id
                // TODO: check if user has enough rewards if user used rewards

            insertQuery = mysql.format(Queries.booking.book, [requestedBooking.user, req.body.room_id, req.body.total_price, req.body.cancellation_charge, req.body.date_in, req.body.date_out, "booked"])
        }
        else{
            insertQuery = mysql.format(Queries.booking.book, [null, req.body.room_id, req.body.total_price, req.body.cancellation_charge, req.body.date_in, req.body.date_out, "booked"])
        }
        console.log(insertQuery)


        // Check if payment valid?


        // Make booking
        let insertResult;
        try{
            insertResult = await Queries.run(insertQuery)
        } catch(error){
            res.status(400).send(error)
            return
        }
        console.log(insertResult)
        let bookingID = insertResult.insertId
        res.status(200).send({message:`created booking #${bookingID}`, data: bookingID})

    }

    // Check values
    console.log(req.body);

    if (! dateChecker(req.body, res)){
        return
    }
    console.log(req.body)
    

    let requestedBooking = {}
    requestedBooking.room_id = req.body.room_id
    requestedBooking.date_in = req.body.date_in
    requestedBooking.date_out = req.body.date_out
    requestedBooking.total_price = req.body.total_price
    requestedBooking.cancellation_charge = req.body.cancellation_charge
    requestedBooking.user = req.user ? req.user.user_id : null

    console.log(req.user)

    makeRes(requestedBooking)

})

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

module.exports = router;