var validator = require('validator');
/**
 * Checks if rooms is object with format [{room:Integer >=0, price:Float >=0}, {room:Integer>=0,price:Float >=0}]
 * @param {*} rooms
 * @param {*} res
 * Express response object
 * @returns True if all elements in rooms follow correct format and possible values
 * When false, sends a 400 response with error message
 */
function room_format_checker(rooms, res) {
    for (i = 0; i < rooms.length; i++) {
        let room = rooms[i].room + '';
        let price = rooms[i].price + '';
        if (typeof (room) == 'undefined' || !validator.isInt(room, { min: 0 })) {
            res.status(400).send("Error: Encountered an invalid room value inside rooms");
            return false;
        }
        if (typeof (price) == 'undefined' || !validator.isFloat(price, { min: 0 })) {
            res.status(400).send("Error: Encountered an invalid room price value inside rooms");
            return false;
        }
    }
    return true;
}
exports.room_format_checker = room_format_checker;
