var Queries = require('../../queries');
var mysql = require("mysql")
const { TAX_RATE, CANCELLATION_CHARGE_RATE } = require("./rates");
/**
 * Checks that the requested rooms are bookable and that the submitted room prices are correct,
 * and checks that the total_price, cancellation_charge in requestedBooking are correct too
 * and checks if requested rooms are all at the same hotel
 * @param {*} requestedBooking
 * @param {*} res Express response object
 * @returns True if passes checks, else sends http response containing an error msg and returns false
 */
async function availability_SameHotel_AndPriceCheck(requestedBooking, res) {
    let requestedRooms = requestedBooking.rooms.map(ele => ele.room);
    // console.log(requestedRooms);
    let query = Queries.booking.bookableAndPriceCheck({ 
        "date_in": requestedBooking.date_in, 
        "date_out": requestedBooking.date_out, 
        "rooms": requestedRooms });
    return common(res,query)
}
exports.availability_SameHotel_AndPriceCheck = availability_SameHotel_AndPriceCheck;
/**
 * Checks that the requested rooms are bookable and that the submitted room prices are correct,
 * and checks that the total_price, cancellation_charge in requestedBooking are correct too
 * and checks if requested rooms are all at the same hotel
 * IGNORING the existing bookings of the given transaction_id
 * @param {*} newBooking
 * @param {*} res Express response object
 * @returns True if passes checks, else sends http response containing an error msg and returns false
 */
async function modify_Availability_SameHotel_AndPriceCheck(newBooking, transaction_id, res) {
    let requestedRooms = newBooking.rooms.map(ele => ele.room);
    // console.log(requestedRooms);
    let query = Queries.booking.modify_BookableAndPriceCheck({
        "date_in": newBooking.date_in,
        "date_out": newBooking.date_out,
        "rooms": requestedRooms,
        "transaction_id": transaction_id
    });

    return common(res, query)

    
}
exports.modify_Availability_SameHotel_AndPriceCheck = modify_Availability_SameHotel_AndPriceCheck;

async function common(res, query){
    let bookableAndPriceCheckResults;
    try {
        bookableAndPriceCheckResults = await Queries.run(query);
    }
    catch (e) {
        // query failed for some reason
        console.log(e);
        res.status(400).send("bad");
        return false;
    }
    // check all requested rooms are at the same hotel
    let requestedHotels = [];
    requestedHotels = bookableAndPriceCheckResults.map(ele => ele.hotel_id);
    // console.log(`requestedHotels ${requestedHotels}`);
    let distinctRequestedHotels = [...new Set(requestedHotels)];
    // console.log(`distinctRequestedHotels ${distinctRequestedHotels}`);
    if (distinctRequestedHotels.length != 1) {
        res.status(400).send(`Not all rooms requested are at the same hotel`);
        return false;
    }
    if (distinctRequestedHotels[0] != newBooking.hotel_id) {
        res.status(400).send(`Submitted hotel_id ${newBooking.hotel_id} and hotel of submitted room_ids ${distinctRequestedHotels[0]} mismatch`);
        return false;
    }
    // check all requested rooms bookable
    let roomsAlreadyBooked = [];
    for (i = 0; i < bookableAndPriceCheckResults.length; i++) {
        if (bookableAndPriceCheckResults[i].booked) {
            roomsAlreadyBooked.push(bookableAndPriceCheckResults[i].room_id);
        }
    }
    if (roomsAlreadyBooked.length > 0) {
        res.status(400).send(`At least one of the requested room(s): [${roomsAlreadyBooked}] is/are booked during the selected timespan`);
        return false;
    }
    // check client submitted room prices match server
    let roomsWithInvalidSubmittedPrice = [];
    for (i = 0; i < bookableAndPriceCheckResults.length; i++) {
        let submittedData = newBooking.rooms[i];
        let submittedRoom = submittedData.room;
        let serverData = bookableAndPriceCheckResults.filter(ele => ele.room_id == submittedRoom);
        // console.log(serverData);
        // console.log(submittedData);
        if (serverData[0].price != submittedData.price) {
            roomsWithInvalidSubmittedPrice.push(submittedRoom);
        }
    }
    if (roomsWithInvalidSubmittedPrice.length > 0) {
        res.status(400).send(`At least one of the requested room(s): [${roomsWithInvalidSubmittedPrice}] has incorrect price`);
        return false;
    }
    // check client submitted total price, cancellation charge accurate
    let server_prices = bookableAndPriceCheckResults.map(ele => ele.price);
    // console.log(server_prices);
    let server_sumOfHotelPrices = server_prices.reduce((acc, curr) => { return acc + curr; });
    // console.log(`server_sumOfHotelPrices ${server_sumOfHotelPrices}`);
    const nights_stayed = ((new Date(newBooking.date_out) - new Date(newBooking.date_in)) / (24 * 60 * 60 * 1000));
    // console.log(nights_stayed);
    // check total price
    let server_total_price = (server_sumOfHotelPrices * nights_stayed * (1 + (TAX_RATE / 100))).toFixed(2);
    server_total_price = parseFloat(server_total_price);
    // console.log(server_total_price);
    // console.log(newBooking.total_price);
    if (newBooking.total_price != server_total_price) {
        res.status(400).send("Total price does not match price on server");
        return false;
    }
    // check cancellation charge
    let server_cancellation_charge = (server_sumOfHotelPrices * nights_stayed * (CANCELLATION_CHARGE_RATE / 100)).toFixed(2);
    server_cancellation_charge = parseFloat(server_cancellation_charge);
    // console.log(server_cancellation_charge);
    if (newBooking.cancellation_charge != server_cancellation_charge) {
        res.status(400).send("Cancellation charge does not match server");
        return false;
    }
    return true;
}

/**
 * Checks that the requested rooms ie (room_type,price,quantity) are bookable
 * @param {Object} requestedBooking
 * @param {Date} requestedBooking.date_in
 * @param {Date} requestedBooking.date_out
 * @param {[Room]} requestedBooking.rooms
 * @param {Number} requestedBooking.hotel_id
 * @param {Express.Response} res Express response object
 * @returns If passes checks, returns {pass: true, availableRequestedRooms}
 * 
 * Note: availableRequestedRooms is the same response as Queries.hotel.room but filtered for requestedBooking.rooms,
 * with additional parameter "desired_quantity"
 * 
 * TODO:// Clarify Return value documentation
 * 
 * Else sends http response containing an error msg and returns {pass: false}
 */
async function availabilityCheck(requestedBooking, res) {
    let result = {}
    let [query, placeholders] = Queries.hotel.room({"hotelID":requestedBooking.hotel_id}, {"date_in":requestedBooking.date_in, "date_out":requestedBooking.date_out});
    // console.log(placeholders)
    let fullQuery = mysql.format(query,placeholders)
    let availableRooms = await Queries.run(fullQuery)
    // console.log(`\navailableRooms is ${JSON.stringify(availableRooms)}\n`)
    // console.log(requestedBooking.rooms)

    let availableRequestedRooms = []
    for(var i=0;i<requestedBooking.rooms.length; i++){
        let reqRoom = requestedBooking.rooms[i]
        let match = availableRooms.find( x => { return x.bed_type === reqRoom.bed_type && x.price === reqRoom.price})
        // console.log(match)
        if (match == undefined){
            // requested room_type & price either not available or not exists
            res.status(400).send(`Requested room_type & price either not available or does not exist for ${JSON.stringify(reqRoom)}`)
            result.pass = false
            return result
        }
        else{
            // requested room_type & price exists and is available
            let desiredNumberOfRooms = reqRoom.quantity
            let availableNumberOfRooms = match.quantity
            if ( desiredNumberOfRooms > availableNumberOfRooms){
                // not enough rooms available
                res.status(400).send(`Not enough rooms of type ${reqRoom.bed_type} at price ${reqRoom.price} available`)
                result.pass = false
                return result
            }
            else{
                // enough rooms available
                match.desired_quantity = reqRoom.quantity
                availableRequestedRooms.push(match)
            }
        }

    }
    result.pass = true
    result.availableRequestedRooms = availableRequestedRooms
    return result

}
exports.availabilityCheck = availabilityCheck;

/**
 * Checks that the client-submitted total_price, cancellation_charge are correct
 * Assumes that prices in requestedBooking are correct
 * @param {Object} requestedBooking
 * @param {Date} requestedBooking.date_in
 * @param {Date} requestedBooking.date_out
 * @param {[Room]} requestedBooking.rooms
 * @param {Number} requestedBooking.hotel_id
 * @param {Number} requestedBooking.total_price
 * @param {Number} requestedBooking.cancellation_charge
 * @param {Express.Response} res Express response object
 * @returns If passes checks, returns {pass: true}
 * 
 * Else sends http response containing an error msg and returns {pass: false}
 */
async function totalPriceAndCancellationChargeCheck(requestedBooking, res) {
    let result = {}
    
    let totalRoomCost = requestedBooking.rooms.reduce( (acc,cur) => acc + (cur.price * cur.quantity),0 )

    // check client submitted total price, cancellation charge accurate
    // console.log(`totalRoomCost ${totalRoomCost}`);
    const nights_stayed = ((new Date(requestedBooking.date_out) - new Date(requestedBooking.date_in)) / (24 * 60 * 60 * 1000));
    // console.log(nights_stayed);
    // console.log(TAX_RATE)
    // check total price
    let server_total_price = (totalRoomCost * nights_stayed * (1 + (TAX_RATE / 100))).toFixed(2)
    // console.log(server_total_price);
    server_total_price = parseFloat(server_total_price);
    // console.log(server_total_price);
    if (requestedBooking.total_price != server_total_price) {
        res.status(400).send("Total price does not match price on server");
        result.pass = false
        return result;
    }
    // check cancellation charge
    let server_cancellation_charge = (totalRoomCost * nights_stayed * (CANCELLATION_CHARGE_RATE / 100)).toFixed(2);
    server_cancellation_charge = parseFloat(server_cancellation_charge);
    console.log(server_cancellation_charge);
    if (requestedBooking.cancellation_charge != server_cancellation_charge) {
        res.status(400).send("Cancellation charge does not match server");
        result.pass = false
        return result;
    }
    result.pass = true
    result.nights_stayed = nights_stayed
    result.totalRoomPricePerNight = totalRoomCost
    return result;
}
exports.totalPriceAndCancellationChargeCheck = totalPriceAndCancellationChargeCheck;

/**
 * Checks that the requested rooms ie (room_type,price,quantity) are bookable
 * @param {Object} requestedBooking
 * @param {Number} requestedBooking.hotel_id
 * @param {Date} requestedBooking.date_in
 * @param {Date} requestedBooking.date_out
 * @param {Number} transaction_id
 * @param {Express.Response} res Express response object
 * @returns If passes checks, returns {pass: true, availableRequestedRooms}
 * 
 * Note: availableRequestedRooms is object containing info about the requested rooms
 * ie
 * [ {room_price: 65,
    bed_type: 'Queen',
    images:
     'https://www.wyndhamhotels.com/content/dam/property-images/en-us/se/us/ok/vinita/02946/02946_guest_room_8.jpg?downsize=1800:*',
    quantity: 1,
    room_ids: [ 2 ],
    price: 65,
    desired_quantity: 1 } ]
 * There may be extra information returned, but this is what data is guaranteed to be in each object
 * 
 * Else sends http response containing an error msg and returns {pass: false}
 */
async function modifyAvailabilityCheck(requestedBooking, transaction_id, res) {
    let result = {}
    let [query, placeholders] = Queries.hotel.room({"hotelID":requestedBooking.hotel_id}, {"date_in":requestedBooking.date_in, "date_out":requestedBooking.date_out});
    // console.log(placeholders)
    let fullQuery = mysql.format(query,placeholders)
    // console.log(fullQuery)
    let availableRooms = await Queries.run(fullQuery)

    fullQuery = mysql.format(Queries.modify.getExistingTransaction,transaction_id)
    let alreadyBookedRooms = await Queries.run(fullQuery)
    // console.log(alreadyBookedRooms)

    let availableRoomsToModify = availableRooms
    for( var i=0;i< alreadyBookedRooms.length; i++ ){
        let alreadyBookedRoomType = alreadyBookedRooms[i]
        let match = availableRoomsToModify.find( x => { return x.bed_type === alreadyBookedRoomType.bed_type && x.price === alreadyBookedRoomType.room_price})
        if (match == undefined){
            // console.log("ABC")
            // console.log(alreadyBookedRoomType)
            alreadyBookedRoomType.price = alreadyBookedRoomType.room_price
            availableRoomsToModify.push(alreadyBookedRoomType)
        }
        else{
            match.room_ids += ","+alreadyBookedRoomType.room_ids
            match.quantity += alreadyBookedRoomType.quantity
        }
    }

    // console.log(`availableRoomsToModify ${JSON.stringify(availableRoomsToModify)}`)

    // check that requestedBookings exist inside availableRoomsToModify
    let availableRequestedRooms = []
    for(var i=0;i<requestedBooking.rooms.length; i++){
        let reqRoom = requestedBooking.rooms[i]
        let match = availableRoomsToModify.find( x => { return x.bed_type === reqRoom.bed_type && x.price === reqRoom.price})
        // console.log("requestedBooking.rooms", requestedBooking.rooms)
        // console.log("availableRoomsToModify", availableRoomsToModify)
        // console.log(match)
        if (match == undefined){
            // requested room_type & price either not available or not exists
            res.status(400).send("Requested room_type & price either not available or does not exist")
            result.pass = false
            return result
        }
        else{
            // requested room_type & price exists and is available
            // console.log(`checking room quantity for ${reqRoom.bed_type} at price ${reqRoom.price}`)
            let desiredNumberOfRooms = reqRoom.quantity
            // console.log(desiredNumberOfRooms)
            let availableNumberOfRooms = match.quantity
            // console.log(availableNumberOfRooms)
            if ( desiredNumberOfRooms > availableNumberOfRooms){
                // not enough rooms available
                res.status(400).send(`Not enough rooms of type ${reqRoom.bed_type} at price ${reqRoom.price} available`)
                result.pass = false
                return result
            }
            else{
                // enough rooms available
                match.desired_quantity = reqRoom.quantity
                availableRequestedRooms.push(match)
            }
        }

    }
    result.pass = true
    result.availableRequestedRooms = availableRequestedRooms
    return result

}
exports.modifyAvailabilityCheck = modifyAvailabilityCheck;