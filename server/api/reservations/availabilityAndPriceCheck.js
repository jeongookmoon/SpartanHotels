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
    console.log(requestedRooms);
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
    console.log(requestedRooms);
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
    console.log(`requestedHotels ${requestedHotels}`);
    let distinctRequestedHotels = [...new Set(requestedHotels)];
    console.log(`distinctRequestedHotels ${distinctRequestedHotels}`);
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
        console.log(serverData);
        console.log(submittedData);
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
    console.log(server_prices);
    let server_sumOfHotelPrices = server_prices.reduce((acc, curr) => { return acc + curr; });
    console.log(`server_sumOfHotelPrices ${server_sumOfHotelPrices}`);
    const nights_stayed = ((new Date(newBooking.date_out) - new Date(newBooking.date_in)) / (24 * 60 * 60 * 1000));
    console.log(nights_stayed);
    // check total price
    let server_total_price = (server_sumOfHotelPrices * nights_stayed * (1 + (TAX_RATE / 100))).toFixed(2);
    server_total_price = parseFloat(server_total_price);
    console.log(server_total_price);
    console.log(newBooking.total_price);
    if (newBooking.total_price != server_total_price) {
        res.status(400).send("Total price does not match price on server");
        return false;
    }
    // check cancellation charge
    let server_cancellation_charge = (server_sumOfHotelPrices * nights_stayed * (CANCELLATION_CHARGE_RATE / 100)).toFixed(2);
    server_cancellation_charge = parseFloat(server_cancellation_charge);
    console.log(server_cancellation_charge);
    if (newBooking.cancellation_charge != server_cancellation_charge) {
        res.status(400).send("Cancellation charge does not match server");
        return false;
    }
    return true;
}