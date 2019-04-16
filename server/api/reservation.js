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

    if( typeof(req.body.rewards_applied) == 'undefined'){
        requestedBooking.rewards_applied = 0
    }
    else{
        if (!validator.isFloat(req.body.rewards_applied + '',{min:0})){
            res.status(400).send("Invalid rewards_applied")
                return
        }
        requestedBooking.rewards_applied = parseFloat(req.body.rewards_applied)
    }

    // TODO: validation
    requestedBooking.stripe_id = req.body.stripe_id
    requestedBooking.rooms =  req.body.rooms
    requestedBooking.hotel_id = req.body.hotel_id
//    console.log(requestedBooking.rooms[0])
    

    console.log(req.user)

    makeRes(requestedBooking)

    async function makeRes(requestedBooking={}){

        let checkPassed = false

        checkPassed = await availability_SameHotel_AndPriceCheck(requestedBooking, res)
        if(!checkPassed){
            return
        }

        checkPassed = await bookingConflictWithAnotherHotelCheck(requestedBooking, res)
        if(!checkPassed){
            return
        }

        let insertTransactionQuery; // store query to insert into transaction table
        let insertTransactionRoomDataQuery; // store query to insert into transaction_room table

        checkPassed = await paymentCheck(requestedBooking, res)
        if(!checkPassed){
            return
        }

        if (requestedBooking.user){
            // make query to insert as user
            insertTransactionQuery = mysql.format(Queries.booking.makeTransaction, [requestedBooking.user, null, req.body.total_price, req.body.cancellation_charge, req.body.date_in, req.body.date_out, "booked", req.body.amount_paid, req.stripe_id])
            
        }
        else{   // is guest
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
        try{
            insertResult = await Queries.run(insertTransactionQuery)
        } catch(error){
            res.status(400).send(error)
            return
        }
        console.log(insertResult)
        let transactionID = insertResult.insertId

        // insert transaction rooms
        insertTransactionRoomDataQuery = mysql.format(Queries.booking.makeTransactionDetails(transactionID,requestedBooking.rooms))
        console.log(`hello ${insertTransactionRoomDataQuery}`)

        try{
            await Queries.run(insertTransactionRoomDataQuery)
        } catch(error){
            res.status(400).send(error)
            return
        }



        if(! requestedBooking.user){
            res.status(200).send({message:`created transaction #${transactionID}`, data: transactionID})
        }
        else{
            // update rewards applied
            if( requestedBooking.rewards_applied > 0){
                let rewardAppliedQuery = mysql.format(Queries.rewards.useOnBooking,[requestedBooking.user, transactionID, (-1) * requestedBooking.rewards_applied])
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

            let rewardGainedQuery = mysql.format(Queries.rewards.gainFromBooking,[requestedBooking.user, transactionID, requestedBooking.date_out,rewardsGained])
            let rewardGainedResult;
            try{
                rewardGainedResult = await Queries.run(rewardGainedQuery)
            } catch(error){
                res.status(400).send(error)
                return
            }


            res.status(200).send({message:`created transaction #${transactionID}`, data: transactionID})

        }
        
    }

})

// TODO: Check if it is valid and it works
router.post('/cancellation', (req,res)=>{
    console.log(req.body);
    cancelReservation(req.body.transaction_id, req.user.user_id, res)
})

// TODO: Does not work
router.post('/modification', (req,res)=>{
    // TODO: check for user id to match the booking
    // Currently checks for valid user first then runs the modify query
    console.log(req.body);
    //console.log(req.session.passport.user.user_id)
    let query = mysql.format(Queries.booking.user_id, [req.body.booking_id])

    Queries.run(query).then(
        results => {
            console.log(results[0].user_id)
            console.log(req.user.user_id)
            console.log(results[0].status)
            if(results[0].user_id == req.user.user_id) {
                console.log("Id matches")
                //Can only modify a booking once
                if(results[0].status != 'modified') {
                    console.log("Booking has not been modified before")

                    if (!dateChecker(req.body, res)){
                        return
                    }
                    
                    let requestedBooking = {}
                    requestedBooking.booking_id = req.body.booking_id
                    requestedBooking.room_id = req.body.room_id
                    requestedBooking.date_in = req.body.date_in
                    requestedBooking.date_out = req.body.date_out
                    //requestedBooking.total_price = req.body.total_price
                    //requestedBooking.cancellation_charge = req.body.cancellation_charge
                   
                    if(typeof(req.body.amount_paid) == 'undefined' || !validator.isFloat(req.body.amount_paid + '')){
                        res.status(400).send("Invalid amount_paid")
                            return
                    }
                    requestedBooking.amount_paid = parseFloat(req.body.amount_paid)

                    if( typeof(req.body.rewards_applied) == 'undefined'){
                        requestedBooking.rewards_applied = 0
                    }
                    else{
                        if (!validator.isFloat(req.body.rewards_applied + '',{min:0})){
                            res.status(400).send("Invalid rewards_applied")
                                return
                        }
                        requestedBooking.rewards_applied = parseFloat(req.body.rewards_applied)
                    }

                    modifyBooking(requestedBooking)

                    async function modifyBooking(requestedBooking={}) {
                        let checkPassed = false

                        checkPassed = await modifyCheck(requestedBooking, res)
                        if(!checkPassed){
                            return
                        }

                        /*
                        checkPassed = await modifyAvailabilityAndPriceCheck(requestedBooking, res)
                        if(!checkPassed){
                            return
                        }
                        */

                        /*
                        checkPassed = await multipleBookingCheck(requestedBooking, res)
                        if(!checkPassed){
                            return
                        }
                        */

                        let insertBookingQuery;
                        if (requestedBooking.user){
                            // if user is member
                            
                            // check if user has enough rewards if user used rewards
                            checkPassed = await modifySufficientRewardsCheck(requestedBooking, res)
                            if(!checkPassed){
                                return
                            }

                            if(requestedBooking.rewards_applied > requestedBooking.total_price){
                                res.status(400).send(`Rewards applied ${requestedBooking.rewards_applied} is more than ${requestedBooking.total_price}`)
                                return
                            }

                            // check that total_price = amount_paid + rewards_applied
                            // TODO: reward conversion rate
                            // console.log(` total ${requestedBooking.amount_paid + requestedBooking.rewards_applied}`)
                            if( requestedBooking.total_price != requestedBooking.amount_paid + requestedBooking.rewards_applied){
                                res.status(400).send(`Amount due ${requestedBooking.total_price} doesnt match ${requestedBooking.amount_paid + requestedBooking.rewards_applied}`)
                                return
                            }
                            // make query to insert as user
                            insertBookingQuery = mysql.format(Queries.booking.modify, [req.body.room_id, req.body.date_in, req.body.date_out, req.body.booking_id])
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
                            res.status(200).send({message:`modified booking #${bookingID}`, data: bookingID})
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


                            res.status(200).send({message:`modified booking #${bookingID}`, data: bookingID})
                        }
                        
                    }

                    /*
                    let query2 = mysql.format(Queries.booking.modify, 
                    [req.body.room_id, req.body.date_in, req.body.date_out, req.body.booking_id]);
                    console.log(query2)
                    Queries.run(query2).then(
                        results =>{
                            res.status(200).send(results)
                        },
                        error =>{
                            res.status(400).send(error)
                        }
                    )
                    */   
                }
                else {
                    console.log("Booking can only be modified once.")
                    // TODO: Make proper error message for client when can't modify a 
                    // previously modified booking
                    res.status(400).send(error)
                }
                
                
            }
            else {
                console.log("Id does not match")
            }
        },
        error => {
            console.log("Error")
        }

    )

})

/*
router.post('/check', (req,res)=>{
    // Check values
    console.log(req.body);
    
    if (! dateChecker(req.body, res)){
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
                let cantModify = (Array.isArray(queryResults) && queryResults.length) ? true : false
    
                if(cantModify){
                    console.log("Cannot modifify date conflict")
                    res.status(400).send("Cannot modify this booking during this time.")   
                    return false
                }

            return true
}

/*
async function modifyAvailabilityAndPriceCheck(requestedBooking, res){
    // Check if this booking is possible
    // TODO: Run another query to check if requestedBooking.booking_id and
    //         requestedBooking.room_id matches in the database and status = booked, if matches
    //         then return true and check passes, else go through the isBookable query
  let query = Queries.booking.isOldBookingIdAndRoomId({
                  booking_id: requestedBooking.booking_id,
                  room_id: requestedBooking.room_id
              })
  let isOldBookingIdAndRoomIdResults;
  try{
      isOldBookingIdAndRoomIdResults = await Quries.run(query)
  } catch(e) {
      console.log(e)
      res.status(400).send("bad")
      return false
  }
  console.log(isOldBookingIdAndRoomIdResults)
  let isOldBooking = (Array.isArray(isOldBookingIdAndRoomIdResults) && 
                          isOldBookingIdAndRoomIdResults.length) ? true : false

  if(!isOldBooking) {
        let query2 = Queries.booking.isBookable(requestedBooking)
        let bookingAvailableResults;
        try{
            bookingAvailableResults = await Queries.run(query2)
        } catch(e){
            // query failed for some reason
            console.log(e)
            res.status(400).send("bad")
            return false
        }
        console.log(bookingAvailableResults)
        let bookable = bookingAvailableResults[0].available;
        if(!bookable){
            console.log(false)
            res.status(400).send("This room is not bookable during the selected timespan")   
            return false
        }
  }
    //TODO: EDIT this so that it fits the new total price, refund, rewards_applied, etc.. for modify
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
*/

/*

//TODO: TBD, need to know how to edit this to fit new idea
async function modifyMultipleBookingCheck(requestedBooking,res){
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
*/

/*
async function modifySufficientRewardsCheck(requestedBooking,res){
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
        //TODO: Query to get the old booking id's applied reward points then add
        //        it to queryResults[0].sum, which will be the new avaiable rewards
        //        Then check, available Rewards < new.rewards_applied, if true then reward points are not
        //        enough, else check passes
        let availableRewards = queryResults[0].sum
        console.log(`availableRewards before adding old booking applied 
            rewards is ${availableRewards}`)

        //query rewards.getOldBookingAppliedRewards
        // Math.abs(x) -> returns the absolute value of a number
        
        let query = mysql.format(Queries.rewards.getOldBookingAppliedRewards, [requestedBooking.booking_id])
        console.log(query)
        try{
            results = await Queries.run(query)
        } catch(e){
            // query failed for some reason
            console.log(e)
            res.status(400).send("bad")
            return false
        }

        let oldBookingAppliedRewards = Math.abs(results[0].change)
        console.log(`Old booking applied rewards: ${oldBookingAppliedRewards}`)

        let newAvailableRewards = availableRewards + oldBookingAppliedRewards
        console.log(`New booking available rewards: ${newAvailableRewards}`)

        if(newAvailableRewards < requestedBooking.rewards_applied){
            res.status(400).send("User doesn't have enough reward points")
            return false
        }
    }
    return true
}
*/

/**
 * Checks that the requestedBooking doesnt conflict with existing bookings at other hotels
 * requestedBooking is ok if existing bookings are at the same hotel during this timespan
 * This check only applies to users
 * @param {*} requestedBooking 
 * @param {*} res Express response object
 * @returns True if passes checks, else sends http response containing an error msg and returns false
 */
async function bookingConflictWithAnotherHotelCheck(requestedBooking,res){
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

                // check that the all booking conflicts for this user are at the same hotel
                let conflictingHotels = []
                conflictingHotels = queryResults.map(ele=>ele.hotel_id)
                console.log(`conflictingHotels ${conflictingHotels}`)
                let distinctConflictingHotels = [... new Set(conflictingHotels)]
                console.log(`distinctConflictingHotels ${distinctConflictingHotels}`)
                // remove desired hotel from being conflicted
                distinctConflictingHotels = distinctConflictingHotels.filter(ele=> ele != requestedBooking.hotel_id )
                if(distinctConflictingHotels.length > 0){
                    res.status(400).send(`Attempted booking overlaps with existing bookings at hotels ${distinctConflictingHotels}`) 
                    return false
                }
            }
            return true
}

/**
 * Checks that the requested rooms are bookable and that the submitted room prices are correct,
 * and checks that the total_price, cancellation_charge in requestedBooking are correct too
 * and checks if requested rooms are all at the same hotel
 * @param {*} requestedBooking 
 * @param {*} res Express response object
 * @returns True if passes checks, else sends http response containing an error msg and returns false
 */
async function availability_SameHotel_AndPriceCheck(requestedBooking, res){
    let requestedRooms = requestedBooking.rooms.map(ele=>ele.room)
    console.log(requestedRooms)

    let query = Queries.booking.bookableAndPriceCheck({"date_in":requestedBooking.date_in, "date_out":requestedBooking.date_out, "rooms":requestedRooms})
    let bookableAndPriceCheckResults;
    try{
        bookableAndPriceCheckResults = await Queries.run(query)
    } catch(e){
        // query failed for some reason
        console.log(e)
        res.status(400).send("bad")
        return false
    }

    // check all requested rooms are at the same hotel
    let requestedHotels = []
    requestedHotels = bookableAndPriceCheckResults.map(ele=>ele.hotel_id)
    console.log(`requestedHotels ${requestedHotels}`)
    let distinctRequestedHotels = [... new Set(requestedHotels)]
    console.log(`distinctRequestedHotels ${distinctRequestedHotels}`)
    if(distinctRequestedHotels.length != 1){
        res.status(400).send(`Not all rooms requested are at the same hotel`) 
        return false
    }
    if( distinctRequestedHotels[0] != requestedBooking.hotel_id){
        res.status(400).send(`Submitted hotel_id and room_ids mismatch`) 
        return false
    }

    // check all requested rooms bookable
    let roomsAlreadyBooked = []
    for(i=0;i<bookableAndPriceCheckResults.length;i++){
        if(bookableAndPriceCheckResults[i].booked){
            roomsAlreadyBooked.push(bookableAndPriceCheckResults[i].room_id)
        }
    }
    if (roomsAlreadyBooked.length > 0) {
        res.status(400).send(`At least one of the requested room(s): [${roomsAlreadyBooked}] is/are booked during the selected timespan`) 
        return false
    }

    // check client submitted room prices match server
    let roomsWithInvalidSubmittedPrice = []
    for(i=0;i<bookableAndPriceCheckResults.length;i++){
        let submittedData = requestedBooking.rooms[i]
        let submittedRoom = submittedData.room
        let serverData = bookableAndPriceCheckResults.filter(ele=> ele.room_id == submittedRoom)
        console.log(serverData)
        console.log(submittedData)
        if (serverData[0].price != submittedData.price){
           roomsWithInvalidSubmittedPrice.push(submittedRoom)
        }
    }
    if( roomsWithInvalidSubmittedPrice.length > 0){
        res.status(400).send(`At least one of the requested room(s): [${roomsWithInvalidSubmittedPrice}] has incorrect price`) 
        return false
    }

    // check client submitted total price, cancellation charge accurate
    let server_prices = bookableAndPriceCheckResults.map(ele =>ele.price)
    console.log(server_prices)
    let server_sumOfHotelPrices = server_prices.reduce( (acc,curr)=>{ return acc + curr})
    console.log(`server_sumOfHotelPrices ${server_sumOfHotelPrices}`)
    const nights_stayed = ((new Date(requestedBooking.date_out) - new Date(requestedBooking.date_in))/(24*60*60*1000))
    console.log(nights_stayed)

    // check total price
    let server_total_price = (server_sumOfHotelPrices * nights_stayed * (1 + (TAX_RATE/100))).toFixed(2)
    server_total_price = parseFloat(server_total_price)
    console.log(server_total_price)
    console.log(requestedBooking.total_price)
    if ( requestedBooking.total_price != server_total_price){
        res.status(400).send("Total price does not match price on server")   
        return false
    }
    
    // check cancellation charge
    let server_cancellation_charge = (server_sumOfHotelPrices * nights_stayed * (CANCELLATION_CHARGE_RATE/100)).toFixed(2)
    server_cancellation_charge = parseFloat(server_cancellation_charge)
    console.log(server_cancellation_charge)
    if (requestedBooking.cancellation_charge != server_cancellation_charge){
        res.status(400).send("Cancellation charge does not match server")   
        return false
    }

    return true
}

/**
 * Assumes requestedBooking is made by user
 * Checks that the user has enough reward points to apply to their requestedBooking
 * @param {*} requestedBooking 
 * @param {*} res Express response object
 * True if passes checks, else sends http response containing an error msg and returns false
 */
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

/**
 * Checks that the payment is sufficient; takes rewards into account if used
 * @param {*} requestedBooking 
 * @param {*} res Express response object
 * True if passes checks, else sends http response containing an error msg and returns false
 */
async function paymentCheck(requestedBooking,res){
    
    if (requestedBooking.user){
        // if user is member
        
        // check if member has enough rewards if they used rewards
        checkPassed = await sufficientRewardsCheck(requestedBooking, res)
        if(!checkPassed){
            return false
        }

        if(requestedBooking.rewards_applied > requestedBooking.total_price){
            res.status(400).send(`Rewards applied ${requestedBooking.rewards_applied} is more than ${requestedBooking.total_price}`)
            return false
        }

        // check that total_price = amount_paid + rewards_applied
        // TODO: reward conversion rate
        // console.log(` total ${requestedBooking.amount_paid + requestedBooking.rewards_applied}`)
        if( requestedBooking.total_price != requestedBooking.amount_paid + requestedBooking.rewards_applied){
            res.status(400).send(`Amount due ${requestedBooking.total_price} doesnt match amount paid (including rewards) ${requestedBooking.amount_paid + requestedBooking.rewards_applied}`)
            return false
        }
        
    }
    else{   // is guest
        // check that total_price = amount_paid
        // TODO: reward conversion rate
        if( requestedBooking.total_price != requestedBooking.amount_paid){
            res.status(400).send(`Amount due ${requestedBooking.total_price} doesnt match amount paid ${requestedBooking.amount_paid}`)
            return false
        }

    }
    return true
}

function cancelReservation(transaction_id, user_id, res) {
let query = mysql.format(Queries.booking.user_id, [transaction_id])
    Queries.run(query).then(
        results => {
            //console.log(results)
            //console.log(results[0].user_id)
            //console.log(req.user.user_id)
            if(results[0].user_id == user_id) {
                console.log("Id matches")
                //Checks if the date_in and date_out is acceptable to cancel
                let query2 = mysql.format(Queries.booking.isCancellable({
                    transaction_id: transaction_id
                }))
                //console.log(query2)
                Queries.run(query2).then(
                        results2 =>{
                            let isCancelConflict = (Array.isArray(results2) && results2.length) ? true : false
                            if(isCancelConflict){
                                console.log("There is a date conflict for cancelling.")
                                res.status(400).send("Cannot cancel because current date is in conflict with booking dates")   
                            }
                            else {
                                /*
                                console.log(req.body.room_id)
                                if(typeof(req.body.room_id) || req.body.room_id == 'undefined' ||
                                    req.body.room_id == null) {
                                */
                                    //Cancels the entire transaction
                                    let query3 = mysql.format(Queries.booking.cancel_transaction, [transaction_id]);
                                    //console.log(query3)
                                    Queries.run(query3).then(
                                        results3 =>{
                                            let query4 = mysql.format(Queries.rewards.cancelBooking, [transaction_id]);
                                            //console.log(query4)
                                            Queries.run(query4).then(
                                                results4 =>{
                                                    //Will delete all the transaction_room_id rows that contain that transaction_id
                                                    let query5 = mysql.format(Queries.booking.cancel_all, [transaction_id])
                                                    Queries.run(query5).then(
                                                        results5 => {
                                                        console.log(query5)
                                                        //Refund is the amount paid - cancellation charge
                                                        let refund = results[0].amount_paid - results[0].cancellation_charge
                                                            if(results[0].status == 'booked') {
                                                                res.status(200).send({message: "Booking cancelled & Rewards were refunded",
                                                                                      transaction_id: transaction_id,
                                                                                      amount_refunded: refund.toFixed(2)}) 
                                                            }
                                                            else {
                                                                res.status(400).send("Cannot cancel transaction id: " + transaction_id + " because already cancelled")
                                                            }

                                                        },
                                                        error5 => {
                                                            res.status(400).send(error5)
                                                        }
                                                    )                                   
                                                },
                                                error4 =>{
                                                    res.status(400).send(error4)
                                                }
                                            )  
                                        },
                                        error3 =>{
                                            res.status(400).send(error3)
                                        }
                                    )
                               // }
                                /*
                                else {
                                    //Delete one room from transaction
                                    let query6 = mysql.format(Queries.booking.room_price, [req.body.transaction_id, req.body.room_id])
                                    Queries.run(query6).then(
                                       results6 => {
                                            let newTotalPrice = results[0].total_price - results6[0].room_price - (results6[0].room_price*(TAX_RATE/100)
                                            let newAmountPaid = results[0].amount_paid - results6[0].room_price - (results6[0].room_price*(TAX_RATE/100)
                                            let newCancellationCharge = results[0].cancellation_charge - (results6[0].room_price*(CANCELLATION_CHARGE_RATE/100)
                                            let query7 = mysql.format(Queries.booking.cancel_one_room, [parseFloat(newTotalPrice), parseFloat(newCancellationCharge), 
                                                parseFloat(newAmountPaid), req.body.transaction_id])
                                            Queries.run(query7).then(
                                               results7 => {
                                                   //Another query8 for cancel_one which deletes it from the table
                                                   //Another query9 to subtract reward points from the cancelled booking

                                               },
                                               error7 => {
                                                   res.status(400).send(error6)
                                               } 


                                            )

                                       },
                                       error6 => {
                                           res.status(400).send(error6)
                                       } 


                                    )
                                    
                                } 
                                 */
                            }
                        },
                        error2 =>{
                            res.status(400).send(error2)
                        }
                    ) 
                
            }
            else {
                console.log("Id does not match")
                res.status(400).send("User Id does not match")
            }
        },
        error => {
            console.log("Error")
            res.status(400).send(error)
        }
    )
}
module.exports = router;