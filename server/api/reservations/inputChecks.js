const validator = require('validator');
let checks = require("../_checks")
const {room_type_format_checker} = require("./room_format_checker") 

function inputChecks(req, res) {

    let returnValues = { "status": false, "requestedBooking": {} }

    if (!checks.date_checker(req.body, res)) {
        return returnValues
    }

    let requestedBooking = {}
    requestedBooking.room_id = req.body.room_id
    requestedBooking.date_in = req.body.date_in
    requestedBooking.date_out = req.body.date_out

    if (req.user) {
        requestedBooking.user = req.user.user_id
    }
    else {
        // is guest
        requestedBooking.user = null
        requestedBooking.guest_email = req.body.guest_email ? req.body.guest_email : ''
        requestedBooking.guest_name = req.body.guest_name ? req.body.guest_name : "GUEST"

        if (typeof (requestedBooking.guest_email) == 'undefined' || !validator.isEmail(requestedBooking.guest_email)) {
            res.status(400).send("Invalid email")
            return returnValues
        }
    }

    if (typeof (req.body.amount_due_from_user) == 'undefined' || !validator.isFloat(req.body.amount_due_from_user + '')) {
        res.status(400).send("Invalid amount_due_from_user")
        return returnValues
    }
    requestedBooking.amount_due_from_user = parseFloat(req.body.amount_due_from_user)

    if (typeof (req.body.rewards_applied) == 'undefined') {
        requestedBooking.rewards_applied = 0
    }
    else {
        if (!validator.isInt(req.body.rewards_applied + '', { min: 0 })) {
            res.status(400).send("Invalid rewards_applied")
            return returnValues
        }
        requestedBooking.rewards_applied = parseInt(req.body.rewards_applied)
    }

    if (!room_type_format_checker(req.body.rooms, res)) {
        return returnValues
    }
    requestedBooking.rooms = req.body.rooms

    if (typeof (req.body.hotel_id) == 'undefined' || !validator.isInt(req.body.hotel_id + '', { min: 0 })) {
        res.status(400).send("Invalid hotel_id")
        return returnValues
    }
    requestedBooking.hotel_id = req.body.hotel_id
    if (typeof (req.body.total_price) == 'undefined' || !validator.isFloat(req.body.total_price + '')) {
        res.status(400).send("Invalid total_price")
        return returnValues
    }
    requestedBooking.total_price = req.body.total_price
    if (typeof (req.body.cancellation_charge) == 'undefined' || !validator.isFloat(req.body.cancellation_charge + '')) {
        res.status(400).send("Invalid cancellation_charge")
        return returnValues
    }
    requestedBooking.cancellation_charge = req.body.cancellation_charge

    // TODO: validation
    requestedBooking.stripe_id = req.body.stripe_id

    return { "status": true, "requestedBooking": requestedBooking }
}

exports.inputChecks = inputChecks