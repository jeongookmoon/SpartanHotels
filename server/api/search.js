var express = require('express');
var router = express.Router({mergeParams: true});
const passport = require('../auth.js')
var Queries = require('../queries')
var mysql = require('mysql')

const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyParser = require('body-parser')

var validator = require('validator');

const checks = require("./_checks")

router.get('/hotels', (req,res)=>{
    console.log(req.query)

    if (! checks.date_checker(req.query, res)){
        return
    }

    if( typeof(req.query.zip) != 'undefined' && !validator.isPostalCode(req.query.zip,'US')){
        res.status(400).send("Error: invalid US zip")
        return
    }

    if ( typeof(req.query.rating) != 'undefined' && !validator.isInt(req.query.rating,{min:0,max:5})){
        res.status(400).send("Error: invalid rating specified")
        return
    }
    if ( typeof(req.query.resultsPerPage) != 'undefined' && !validator.isInt(req.query.resultsPerPage,{min:1})){
        res.status(400).send("Error: invalid resultsPerPage specified")
        return
    }
    if ( typeof(req.query.priceGTE) != 'undefined' && !validator.isFloat(req.query.priceGTE,{min:0})){
        res.status(400).send("Error: invalid priceGTE specified")
        return
    }
    if ( typeof(req.query.priceLTE) != 'undefined' && !validator.isFloat(req.query.priceLTE,{min:0})){
        res.status(400).send("Error: invalid priceLTE specified")
        return
    }
    if ( parseFloat(req.query.priceGTE) > parseFloat(req.query.priceLTE)){
        res.status(400).send("Error: invalid priceGTE is greater than priceLTE")
        return
    }

    let [query, placeholders] = Queries.hotel.search(req.query)
    console.log(placeholders)
    let fullQuery = mysql.format(query,placeholders)
    console.log(fullQuery);

    // For some reason, trying to reuse query & placeholder values gives error: 
    // Cannot set property '[object Array]' of undefined
    // [query, placeholders] = Queries.hotel.search(req.query, true)

    // This gives error too: x is not defined
    // let x = Queries.hotel.search(req.query,true)
    // [query, placeholders] = x

    // However, this works. Note the semicolon:
    // let x = Queries.hotel.search(req.query,true);
    // [query, placeholders] = x
    // Maybe related: https://stackoverflow.com/questions/40539854/node-js-foreach-cannot-read-property-object-array-of-undefined

    // Definitely: https://stackoverflow.com/questions/40539854/node-js-foreach-cannot-read-property-object-array-of-undefined
    // make sure the line before a destructuring ends with semicolon
    // "let [x,y,z] = ..." destructuring probably doesnt need semicolon for line before it bc of keyword 'let'

    
    [query, placeholders] = Queries.hotel.search(req.query,true)    
    // console.log("COUNT" + query)
    let fullQueryForCount = mysql.format(query,placeholders)
    console.log("COUNT" + fullQueryForCount)


    Promise.all( [Queries.run(fullQuery), Queries.run(fullQueryForCount)] )
    .then(
        values => {
            console.log(values)
            let totalResultCount = values[1][0].count
            console.log(totalResultCount)

            let results = values[0]
            // results is an array of hotel info objects
            // ex [ {hotel A data}, {hotel B data}, {hotel C data} ]

            // console log only when pageNumber and resultsPerPage defined
            if( totalResultCount < (req.query.pageNumber * req.query.resultsPerPage )){
                console.log("no results in this query for the requested page")
            }
            
            res.status(200).send({results, totalResultCount})
        }
    )
    .catch(
        error =>{
            console.log(error)
            res.status(400).send("bad")
        }
    )
    
}),


// AKA room search
// TODO: return appropriate error message when hotelID doesn't exist in database
router.get('/hotels/:hotelID', (req,res)=>{
    console.log(req.query)
    console.log(req.params)

    if ( !validator.isInt(req.params.hotelID)){
        res.status(400).send("Error: hotelID is not a number")
        return
    }
    if (! checks.date_checker(req.query, res)){
        return
    }



    let [query, placeholders] = Queries.hotel.room(req.params, req.query)
    console.log(placeholders)
    let fullQuery = mysql.format(query,placeholders)
    console.log(fullQuery);
    
    [query, placeholders] = Queries.hotel.room(req.params, req.query, true)    
    // console.log("COUNT" + query)
    let fullQueryForCount = mysql.format(query,placeholders)
    console.log("COUNT" + fullQueryForCount)


    Promise.all( [Queries.run(fullQuery), Queries.run(fullQueryForCount)] )
    .then(
        values => {
            console.log(values)
            let totalResultCount = values[1][0].count
            console.log(totalResultCount)

            let results = values[0]
            // results is array of room data
            // ex [ {room type A}, {room type B}, {room type C} ]

            // console log only when pageNumber and resultsPerPage defined
            if( totalResultCount < (req.query.pageNumber * req.query.resultsPerPage )){
                console.log("no results in this query for the requested page")
            }
            
            res.status(200).send({results, totalResultCount})
        }
    )
    .catch(
        error =>{
            console.log(error)
            res.status(400).send("something went wrong")
        }
    )

}),


module.exports = router;