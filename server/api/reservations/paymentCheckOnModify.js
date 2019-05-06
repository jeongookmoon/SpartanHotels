var Queries = require('../../queries');
var mysql = require('mysql');
/**
 * Checks that the payment is sufficient; takes rewards into account if used
 * ie checks amount_paid and rewards_applied
 * @param {*} requestedBooking
 * @param {*} transaction_id
 * @param {*} res Express response object
 * @returns {} {checkFailed:true, amountDueFromUser, oldTransactionData}
 * If any check fails, sends an http response containing an error msg and returns {checkFailed:true, amountDueFromUser, oldTransactionData}
 *
 * Note: amountDueFromUser, oldTransactionData may be NULL
 *
 * If all checks pass, returns {checkFailed:false, amountDueFromUser, oldTransactionData}
 */
async function paymentCheckOnModify(requestedBooking, transaction_id, res) {
    let returnValue = { checkFailed: true, amountDueFromUser: null, oldTransactionData: null };
    if (requestedBooking.user) {
        // if user is member
        // get user's applicable rewards, ie available rewards, but ignoring transction being modified
        let userApplicableRewardsQuery = mysql.format(Queries.user.getAvailableRewardsIgnoringTransaction, [requestedBooking.user, transaction_id]);
        let userApplicableRewards;
        try {
            userApplicableRewards = await Queries.run(userApplicableRewardsQuery);
        }
        catch (e) {
            // query failed for some reason
            console.log(e);
            res.status(400).send("bad");
            return returnValue;
        }
        let availableRewards = userApplicableRewards[0].sum;
        console.log(`availableRewards is ${availableRewards}`);
        if (availableRewards < requestedBooking.rewards_applied) {
            res.status(400).send("User doesn't have enough reward points");
            return returnValue;
        }
        let applied_reward_cash_value = requestedBooking.rewards_applied / 100
        if (applied_reward_cash_value > requestedBooking.total_price) {
            res.status(400).send(`Rewards applied value ${applied_reward_cash_value} is more than ${requestedBooking.total_price}`);
            return returnValue;
        }
        // get old transation data
        let oldBookingQuery = mysql.format(Queries.user.getBookingForTransaction, [transaction_id]);
        let oldBookingData;
        try {
            oldBookingData = await Queries.run(oldBookingQuery);
        }
        catch (e) {
            // query failed for some reason
            console.log(e);
            res.status(400).send("bad");
            return returnValue;
        }
        console.log(oldBookingData);
        oldBookingData = oldBookingData[0];
        returnValue.oldTransactionData = oldBookingData;
        
        let amountDueFromUser = requestedBooking.total_price - applied_reward_cash_value //to calculate difference - oldBookingData.amount_paid ;
        amountDueFromUser = parseFloat(amountDueFromUser).toFixed(2)
        console.log(`amountDueFromUser ${amountDueFromUser}`);
        returnValue.amountDueFromUser = parseFloat(amountDueFromUser).toFixed(2);
        // if (amountDueFromUser > 0) {
            // check additional amount_paid 
            if (amountDueFromUser != requestedBooking.amount_due_from_user) {
                res.status(400).send(`Amount due from user ${amountDueFromUser} doesnt match amount_due_from_user ${requestedBooking.amount_due_from_user}`);
                return returnValue;
            }
        // }
    }
    else {
        res.status(400).send(`Guest not allowed in modify reservation`);
        return returnValue;
    }
    returnValue.checkFailed = false;
    console.log(returnValue);
    return returnValue;
}
exports.paymentCheckOnModify = paymentCheckOnModify;
