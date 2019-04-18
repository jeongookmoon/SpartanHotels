var validator = require('validator');

/**
 * date_checker accepts an object containing booking date information and performs checks to see if the given info is a valid booking date.
 * 
 * Checks:
 * 
 * both date_in and date_out have values
 * 
 * date_in is before date_out
 * 
 * dates are in yyyy-mm-dd OR mm/dd/yyyy format
 * 
 * Input dates may be modified so that they are in ISO8601 format (yyyy-mm-dd) AS A STRING.
 * It is possible that only one date is modified while the other is not. This can happen if an another check fails before ISO8601 conversion is done for both dates.
 * 
 * @param {*} params 
 * Object containing date_in and date_out
 * @param {*} res 
 * Express response object
 * @returns When conditions met, input params dates are converted to ISO8601 STRING and true is returned
 * 
 * Else: an appropriate response message is sent in a status 400 response and false is returned
 */
function date_checker(params, res ){
    if ( typeof(params.date_in) == 'undefined'){
        res.status(400).send("Error: date_in missing")
        return false
    }
    // if in mm/dd/yyyy format, convert to yyyy-mm-dd
    if( /^\d{1,2}\/\d{1,2}\/\d{1,4}$/.test(params.date_in)){
        params.date_in = new Date(params.date_in + " GMT").toISOString()
    }
    if ( !validator.isISO8601(params.date_in)){
        res.status(400).send("Error: invalid date_in specified")
        return false
    }

    if ( typeof(params.date_out) == 'undefined'){
        res.status(400).send("Error: date_out missing")
        return false
    }
    // if in mm/dd/yyyy format, convert to yyyy-mm-dd
    if( /^\d{1,2}\/\d{1,2}\/\d{1,4}$/.test(params.date_out)){
        params.date_out = new Date(params.date_out + " GMT").toISOString()
    }
    if ( !validator.isISO8601(params.date_out)){
        res.status(400).send("Error: invalid date_out specified")
        return false
    }
    if( new Date(params.date_in).getTime() === new Date(params.date_out).getTime()){
        res.status(400).send("Error: date_in is same as date_out")
        return false
    }
    if( new Date(params.date_in).getTime() > new Date(params.date_out).getTime()){
        res.status(400).send("Error: date_in is after date_out")
        return false
    }
    return true


}

module.exports = {
    date_checker
};