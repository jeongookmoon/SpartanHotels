var express = require('express');
var router = express.Router({mergeParams: true});
var Queries = require('../queries')
var mysql = require('mysql')

const { inputChecks } = require("./reservations/inputChecks")
const { makeReservation } = require("./reservations/makeReservation")
const { modifyReservation } = require("./reservations/modifyReservation")

const bodyParser  = require('body-parser');
const stripe = require("stripe")("sk_test_KMjoJvcxhuiJSV51GJcaJfSi00r9QtVXjo"); // Your Stripe key


router.use(bodyParser.text());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.status(200).send("hello ")
})



router.post("/charge", async (req, res) => {
    
    try {
        var data = JSON.parse(req.body)
    }
    catch (err){
        console.log(err);
        res.status(500).end();
        return
    }
    // Check values
    console.log(data)
    req.body = data
    console.log(data.date_out)
    data.rewards_applied = parseInt(data.rewards_applied)

    let inputCheckResults = inputChecks(req,res)
    let requestedBooking
    if(inputCheckResults.status == true){
        requestedBooking = inputCheckResults.requestedBooking
    }
    else{
        return
    }
    
    let stripeStatus = {}
    stripeStatus.id = null
    if (data.amount_due_from_user >= 0.50){
            console.log("\n\n hello " + data.amount_due_from_user +"\n\n")
            try{
                stripeStatus = await stripe.charges.create({
                    amount: parseInt(data.amount_due_from_user *100) ,
                    currency: "usd",
                    description: "Charge",
                    source: data.id,
                });
                console.log(stripeStatus.id); // retrieves the charge
        
        
            
            console.log(stripeStatus);
            }
            catch (err) {
            console.log(err);
            res.status(500).end();
        }
    }
  // set stripe id
  requestedBooking.stripe_id = stripeStatus.id
  console.log(requestedBooking)

 
    makeReservation(requestedBooking, res)

  
  });
  

  router.post("/modify", async (req, res) => {
    
    try {
        var data = JSON.parse(req.body)
    }
    catch (err){
        console.log(err);
        res.status(500).end();
        return
    }
    // Check values
    console.log(data)
    req.body = data
    console.log(data.date_out)

    let inputCheckResults = inputChecks(req,res)
    let requestedBooking
    if(inputCheckResults.status == true){
        requestedBooking = inputCheckResults.requestedBooking
    }
    else{
        return
    }
    
    let stripeStatus = {}
    stripeStatus.id = null
    if (data.amount_due_from_user >= 0.50){
     
            console.log("\n\n hello " + data.amount_due_from_user +"\n\n")
            try{
                stripeStatus = await stripe.charges.create({
                    amount: parseInt(data.amount_due_from_user *100) ,
                    currency: "usd",
                    description: "Charge",
                    source: data.id,
                });
                console.log(stripeStatus.id); // retrieves the charge
        
        
            
            console.log(stripeStatus);
            }
            catch (err) {
            console.log(err);
            res.status(500).end();
            return
        }
    }
  // set stripe id
  requestedBooking.stripe_id = stripeStatus.id
  console.log(requestedBooking)

 
  modifyReservation(requestedBooking, data.transaction_id, res)

  
  });


module.exports = router;