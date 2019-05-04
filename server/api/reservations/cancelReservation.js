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
                
                let query = mysql.format(Queries.booking.getHotel_Info, [transaction_id])
                Queries.run(query).then(res1 => {
                     let query2 = mysql.format(Queries.modify.getExistingTransaction, [transaction_id])
                     Queries.run(query2).then(res2 => {
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
                                /*
                                let query6 = mysql.format(Queries.booking.cancel_all, [transaction_id]);
                                Queries.run(query6).then(results6 => {

                                }, error6 => {
                                    res.status(400).send(error6);
                                });
                                */
                                    console.log(results4[0]);
                                    //Refund is the amount paid - cancellation charge
                                    let refund = results[0].amount_paid - results[0].cancellation_charge;
                                    let rewards_applied;
                                    if(results4[0] === null || results4[0]=== undefined) {
                                       rewards_applied = 0;
                                    }
                                    else{ 
                                       rewards_applied = Math.abs(results4[0].change)
                                    }
                                    let rewards_applied_scaled = (rewards_applied/100).toFixed(2)
                                    if (results[0].status == 'booked') {
                                        res.status(200).send({
                                            message: "Booking cancelled & Rewards were refunded",
                                            transaction_id: transaction_id,
                                            total_price: results[0].total_price,
                                            amount_refunded: refund.toFixed(2),
                                            cancel_charge: results[0].cancellation_charge.toFixed(2),
                                            reward_refunded: rewards_applied
                                        })
                                        //TODO: Fix this for getting emails and get hotel and room info
                                        //Query getHotel_Info, getExistingTransaction
                                        let q = mysql.format(Queries.user.profile, [user_id])
                                        Queries.run(q).then(res => {
                                           
                                                    let hotelInfo = res1[0]
                                                    console.log(hotelInfo)

                                                    let transactionInfo = res2
                                                    console.log(transactionInfo)

                                                    let dateIn = formatDate(results[0].date_in)
                                                    console.log(dateIn)

                                                    let dateOut = formatDate(results[0].date_out)
                                                    console.log(dateOut)

                                                    var emailAddress = res[0].email
                                                    var emailParams = {};
                                                    console.log(emailAddress)
                                                    
                                                    emailParams.to = emailAddress
                                                    console.log('Email being set to: ' + emailAddress)
                                                    emailParams.subject = 'Your Spartan Hotels Cancellation Receipt!'

                                                    var emailContents = pug.renderFile("./email_templates/cancelReservation.pug", 
                                                                                        { "transaction_number": transaction_id, 
                                                                                          "date": new Date().toLocaleDateString(),
                                                                                          "total_price": results[0].total_price.toFixed(2),
                                                                                          "amount_refunded": refund.toFixed(2),
                                                                                          "rewards_applied": rewards_applied_scaled,
                                                                                          "cancel_charge": results[0].cancellation_charge.toFixed(2),
                                                                                          "reward_refunded": rewards_applied,
                                                                                          "date_in": dateIn,
                                                                                          "date_out": dateOut,
                                                                                          "hotel_info": hotelInfo,
                                                                                          "transaction_info": transactionInfo})
                                                    emailParams.html = emailContents
                                                    var email = Email.email(emailParams)                                  
                                        }, err => {
                                            res.status(400).send(err)
                                        })                                  

                                    }
                                    else {
                                        res.status(400).send("Cannot cancel transaction id: " + transaction_id + " because already cancelled");
                                    }
                            }, error5 => {
                                res.status(400).send(error5);
                            });
                        }, error4 => {
                            res.status(400).send(error4);
                        });
                     }, error3 => {
                        res.status(400).send(error3);
                     });

                     },
                     res2err => {
                         res.status(400).send(res2err)
                     })
                },
                res1err => {
                     res.status(400).send(res1err)
                })

              
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

//Used to get rid of the Time to just get Date string
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
