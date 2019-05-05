var express = require('express');
var router = express.Router({mergeParams: true});
var Queries = require('../queries')
var mysql = require('mysql')

const bodyParser  = require('body-parser');
const stripe = require("stripe")("sk_test_KMjoJvcxhuiJSV51GJcaJfSi00r9QtVXjo"); // Your Stripe key


router.use(bodyParser.text());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.status(200).send("hello ")
})



router.post("/charge", async (req, res) => {
    console.log(req.body)

    try {
      var data = JSON.parse(req.body)
  
      let status = await stripe.charges.create({
        amount: data.total_price*100,
        currency: "usd",
        description: "Charge",
        source: data.id,
      });
  
     console.log(status.id); // retrieves the charge
  
  
     
      console.log(status);
      //console.log("amount: "+data.amount);
      console.log(data);
  
      res.json({status});
  
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  
  
  });
  


module.exports = router;