var Queries = require('../../queries');
var mysql = require('mysql');
const { getUserEmail } = require("./getUserEmail");
var Email = require('../email.js')
const pug = require('pug')

function cancelReservation(transaction_id, user_id, res) {
    let query = mysql.format(Queries.booking.user_id, [transaction_id]);
    console.log(query)
    Queries.run(query).then(results => {
        console.log(results)
        //console.log(results[0].user_id)
        //console.log(req.user.user_id)
        if( typeof(results[0]) == 'undefined'){
            res.status(400).send("Invalid transaction_id")
            return
        }
        if (results[0].user_id == user_id) {
            console.log("Id matches");
            console.log(results[0].user_id)
            console.log(user_id )
            //Checks if the date_in and date_out is acceptable to cancel
            let query2 = mysql.format(Queries.booking.isCancellable({
                transaction_id: transaction_id
            }));
            //console.log(query2)
            Queries.run(query2).then(results2 => {
                let isCancelConflict = (Array.isArray(results2) && results2.length) ? true : false;
                console.log(results2)
                console.log(isCancelConflict)
                if (isCancelConflict) {
                    console.log("There is a date conflict for cancelling.");
                    res.status(400).send("Cannot cancel because current date is in conflict with booking dates");
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
                    Queries.run(query3).then(results3 => {
                        let query4 = mysql.format(Queries.rewards.getOldBookingAppliedRewards, [transaction_id])
                        Queries.run(query4).then(results4 => {
                      
                            let query5 = mysql.format(Queries.rewards.cancelBooking, [transaction_id]);
                            //console.log(query4)
                            Queries.run(query5).then(results5 => {
                                //Will delete all the transaction_room_id rows that contain that transaction_id
                                let query6 = mysql.format(Queries.booking.cancel_all, [transaction_id]);
                                Queries.run(query6).then(results6 => {
                                    console.log(query6);
                                    //Refund is the amount paid - cancellation charge
                                    let refund = results[0].amount_paid - results[0].cancellation_charge;
                                    let rewards_applied;
                                    if(results4[0].change == null || results4[0].change == undefined) {
                                       rewards_applied = 0;
                                    }
                                       rewards_applied = Math.abs(results4[0].change)
                                    if (results[0].status == 'booked') {
                                        res.status(200).send({
                                            message: "Booking cancelled & Rewards were refunded",
                                            transaction_id: transaction_id,
                                            total_price: results[0].total_price,
                                            amount_refunded: refund.toFixed(2),
                                            cancel_charge: results[0].cancellation_charge.toFixed(2),
                                            reward_refunded: rewards_applied
                                        })
                                        //TODO: Fix this for getting emails
                                        let q = mysql.format(Queries.user.profile, [user_id])
                                        Queries.run(q).then(res => {
                                            var emailAddress = res[0].email
                                            var emailParams = {};
                                            console.log(emailAddress)
                                            
                                            emailParams.to = emailAddress
                                            console.log('Email being set to: ' + emailAddress)
                                            emailParams.subject = 'Your Spartan Hotels Cancellation Receipt!'
                                            // emailParams.text = 'Hello. Thank you for booking a reservation using Spartan Hotels. This is an email to confirm you order for: \n' + JSON.stringify(requestedBooking);
                                            var emailContents = pug.renderFile("./email_templates/cancelReservation.pug", 
                                                                                { "transaction_number": transaction_id, 
                                                                                  "date": new Date().toLocaleDateString(),
                                                                                  "total_price": results[0].total_price,
                                                                                  "amount_refunded": refund.toFixed(2),
                                                                                  "cancel_charge": results[0].cancellation_charge.toFixed(2),
                                                                                  "reward_refunded": rewards_applied})
                                            emailParams.html = emailContents
                                            var email = Email.email(emailParams)
                                        }, err => {
                                            res.status(400).send(err)
                                        })                                  

                                    }
                                    else {
                                        res.status(400).send("Cannot cancel transaction id: " + transaction_id + " because already cancelled");
                                    }
                                }, error6 => {
                                    res.status(400).send(error6);
                                });
                            }, error5 => {
                                res.status(400).send(error5);
                            });
                        }, error4 => {
                            res.status(400).send(error4);
                        });
                     }, error3 => {
                        res.status(400).send(error3);
                     });
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
            }, error2 => {
                res.status(400).send(error2);
            });
        }
        else {
            console.log("Id does not match");
            res.status(400).send("User Id does not match");
        }
    }, error => {
        console.log("Error");
        res.status(400).send(error);
    });
}
exports.cancelReservation = cancelReservation;
