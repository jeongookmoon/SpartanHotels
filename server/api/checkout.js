var express = require('express');
var router = express.Router({mergeParams: true});
var Queries = require('../queries')
var mysql = require('mysql')

const bodyParser  = require('body-parser');
const stripe = require("stripe")("sk_test_KMjoJvcxhuiJSV51GJcaJfSi00r9QtVXjo"); // Your Stripe key




router.get('/', (req, res) => {
    router.use(bodyParser.text());
    router.use(bodyParser.urlencoded({ extended: true }));
    res.status(200).send("hello ")
})


module.exports = router;