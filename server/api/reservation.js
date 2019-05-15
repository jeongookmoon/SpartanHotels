const { cancelReservation } = require("./reservations/cancelReservation");

const { inputChecks } = require("./reservations/inputChecks")
const { makeReservation } = require("./reservations/makeReservation")
const { modifyReservation } = require("./reservations/modifyReservation")

var express = require('express');
var router = express.Router({mergeParams: true});
var Queries = require('../queries')
var mysql = require('mysql')
var Email = require('./email.js')
const pug = require('pug')

var validator = require('validator');

// REPLACED WITH /api/checkout/charge
//Make a reservation 
router.post('/', (req, res)=>{

    // Check values
    // console.log(req.body);

    let inputCheckResults = inputChecks(req,res)
    let requestedBooking
    if(inputCheckResults.status == true){
        requestedBooking = inputCheckResults.requestedBooking
    }
    else{
        return
    }
    // console.log(req.user)

    makeReservation(requestedBooking, res)
})

/*
Refer to Tommy's Branch api.js /rewardsHistory for how to format date_in and date_out
Refer to RewardsHistory.js componentDidMont(), renderTables(), and render()
*/
router.get('/viewres', (req, res) => {
    if (typeof(req.user) == 'undefined') {
        res.status(400).send('Not signed in')
        return
    }
    const userid = req.user.user_id
    // console.log(userid)
    let viewquery = mysql.format(Queries.booking.view, [userid])

    Queries.run(viewquery).then((results) => {
        console.log(results)
        for(x = 0; x < results.length ; x++) {
            var newDateIn = formatDate(results[x].date_in)
            var newDateOut = formatDate(results[x].date_out)

            results[x].date_in = newDateIn;
            results[x].date_out = newDateOut;
        }
        res.status(200).send(results)
        console.log("Reservations viewed")
    },
    (error) => {
        res.status(400).send('Cannot retrieve reservations')
    })
})

//Format the date so we display it correctly on the front end
function formatDate(date) {
   var d = new Date(date),
       month = '' + (d.getMonth() + 1),
       day = '' + d.getDate(),
       year = d.getFullYear();

   if (month.length < 2) month = '0' + month;
   if (day.length < 2) day = '0' + day;

   return [year, month, day].join('-');
}

router.post('/cancellation', (req,res)=>{
    // console.log(req.body);
    cancelReservation(req.body.transaction_id, req.user.user_id, res)
})


router.post('/modification', (req,res)=>{

    // Check values
    // console.log(req.body);

    let inputCheckResults = inputChecks(req,res)
    let requestedBooking
    if(inputCheckResults.status == true){
        requestedBooking = inputCheckResults.requestedBooking
    }
    else{
        return
    }

    if( req.body.rooms.length == 0){
        cancelReservation(req.body.transaction_id, req.user.user_id, res)
        return
    }

    if( typeof(req.body.transaction_id) == 'undefined' || !validator.isInt(req.body.transaction_id + '',{min:0})){
        res.status(400).send("Invalid transaction_id")
            return
    }
    let transaction_id = req.body.transaction_id
    if( typeof(req.body.amount_due_from_user) == 'undefined' || !validator.isFloat(req.body.amount_due_from_user + '')){
        res.status(400).send("Invalid amount_due_from_user")
            return
    }
    requestedBooking.amount_due_from_user = req.body.amount_due_from_user

    // TODO: validation
    requestedBooking.stripe_id = req.body.stripe_id
    
    
    console.log(req.user)


    //
    // let requestedBooking = {
    //     "total_price":9634.9,
    //     "cancellation_charge":1751.8,
    //     "date_in":"2019-03-02",
    //     "date_out":"2019-03-21",
    //     "amount_paid":9624.9,
    //     "rewards_applied":10,
    //     "guest_email":"a@a.com",
    //     "rooms": [{"room":8,"price":256},{"room":7,"price":205}],
    //     "hotel_id": 4,
    //     "user_id":2
    //     }
    // let transactionToChange = 43

    modifyReservation(requestedBooking, transaction_id, res)

})

/*
router.post('/check', (req,res)=>{
    // Check values
    console.log(req.body);
    
    if (! _checks.date_checker(req.body, res)){
        return
    }

    let query = Queries.booking.isAlreadyBooked(req.body)

    Queries.run(query)
    .then(
        results =>{
            console.log(results)
            

            if (results.length > 0){
                let bookedRooms = results.map(ele=>ele.room_id)
                
                res.status(200).send(`At least one of the requested room(s): [${bookedRooms}] is/are booked during the selected timespan`)
            }
            else{
                res.status(200).send("All requested rooms are bookable during the selected timespan")
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

*/


/**
 * This check is to see if the selected booking id 
 * can be modified by checking if the date_ins and date_out 
 * are not during the stay of the booking
 * 
 * @param  {[type]} requestedBooking [description]
 * @param  {[type]} res              [description]
 * @return true                Check passes
 */

async function modifyCheck(requestedBooking,res){
                let query = Queries.booking.isModifiable({
                    transaction_id: requestedBooking.transaction_id
                })
                // console.log(query)
                let queryResults;
                try{
                    queryResults = await Queries.run(query)
                } catch(e){
                    // query failed for some reason
                    console.log(e)
                    res.status(400).send("bad")
                    return false
                }
                // console.log(queryResults)
                let cantModify = (Array.isArray(queryResults) && queryResults.length) ? true : false
    
                if(cantModify){
                    console.log("Cannot modifify date conflict")
                    res.status(400).send("Cannot modify this booking during this time.")   
                    return false
                }

            return true
}

module.exports = router;