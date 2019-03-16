var express = require('express');
var router = express.Router();
var Queries = require('./queries')
var mysql = require('mysql')

// Example of sending a response
router.get('/test', (req,res)=>{
    console.log(req.headers)
    res.status(200).send("hello")
})

// Example of running a query and sending that response
router.get('/test2', (req,res)=>{
    console.log(req.headers)

    Queries.run(Queries.sql)
    .then(results =>{
        res.status(200).send(results)
    })
    
})

/* Example of receiving post request, creating a query with escaping, and sending that response
// See https://github.com/mysqljs/mysql#escaping-query-values
// and https://github.com/mysqljs/mysql#preparing-queries

// To test, make a POST request to http://localhost:3001/api/test3
// with x-www-urlencoded body
//  key: name
//  value: Woof or the name of some pet in pets table
*/
router.post('/test3', (req,res)=>{
    console.log(req.body)
    let query = mysql.format(Queries.sql2,[req.body.name])
    console.log(query)

    Queries.run(query).then(
        results =>{
            res.status(200).send(results)
        },
        error =>{
            res.status(400).send(error)
        }
    )
    
}),

//Make a reservation 
router.post('/reservations', (req, res)=>{
    console.log(req.body);
    let query = mysql.format(Queries.booking.book, [req.body.user_id, req.body.room_id, req.body.total_price, req.body.cancellation_charge, req.body.date_in, req.body.date_out, req.body.status])
    console.log(query)

    Queries.run(query).then(
        results =>{
            res.status(200).send(results)
        },
        error =>{
            res.status(400).send(error)
        }
    )
})

router.post('/reservations/cancellation', (req,res)=>{
    console.log(req.body);
    let query = mysql.format(Queries.booking.cancel, [req.body.booking_id]);
    console.log(query)

    Queries.run(query).then(
        results =>{
            res.status(200).send(results)
        },
        error =>{
            res.status(400).send(error)
        }
    )
})



module.exports = router;