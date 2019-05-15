var Queries = require('../../queries');

/**
 * Checks that the requestedBooking doesnt conflict with existing bookings at other hotels
 * requestedBooking is ok if existing bookings are at the same hotel during this timespan
 * This check only applies to users
 * @param {*} requestedBooking
 * @param {*} res Express response object
 * @returns True if passes checks, else sends http response containing an error msg and returns false
 */
async function bookingConflictWithAnotherHotelCheck(requestedBooking, res) {
    // Check for multiple booking under same id
    if (requestedBooking.user) {
        console.log("checking for multiple bookings for user");
        let query = Queries.booking.duplicateBookingCheck({
            user_id: requestedBooking.user,
            date_in: requestedBooking.date_in,
            date_out: requestedBooking.date_out
        });
        // console.log(query);
        let queryResults;
        try {
            queryResults = await Queries.run(query);
        }
        catch (e) {
            // query failed for some reason
            console.log(e);
            res.status(400).send("bad");
            return false;
        }
        // console.log(queryResults);
        // check that the all booking conflicts for this user are at the same hotel
        let conflictingHotels = [];
        conflictingHotels = queryResults.map(ele => ele.hotel_id);
        // console.log(`conflictingHotels ${conflictingHotels}`);
        let distinctConflictingHotels = [...new Set(conflictingHotels)];
        // console.log(`distinctConflictingHotels ${distinctConflictingHotels}`);
        // remove desired hotel from being conflicted
        distinctConflictingHotels = distinctConflictingHotels.filter(ele => ele != requestedBooking.hotel_id);
        if (distinctConflictingHotels.length > 0) {
            res.status(400).send(
                `Attempted booking overlaps with existing bookings at hotels ${distinctConflictingHotels}`
            );
            return false;
        }
    }
    return true;
}
exports.bookingConflictWithAnotherHotelCheck = bookingConflictWithAnotherHotelCheck;



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

