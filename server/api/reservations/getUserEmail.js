var Queries = require('../../queries');
var mysql = require('mysql');

/**
 * 
 * @param {*} userid 
 * @returns email for selected userid
 * Returns "" if error occurs
 */
async function getUserEmail(userid) {
    let emailquery = mysql.format('SELECT email FROM user WHERE user_id = ?', userid);
    let userEmail;
    try {
        userEmail = await Queries.run(emailquery).then(function (results) {
            console.log('email for user is ' + results[0].email);
            return results[0].email;
        });
    }
    catch (e) {
        // query failed for some reason
        console.log(e);
        // res.status(500).send("email service failure");
        return "";
    }
    return userEmail;
}
exports.getUserEmail = getUserEmail;
