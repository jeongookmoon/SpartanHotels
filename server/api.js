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

    // try{
    //     // console("In api.js/reservation");
    //     // console.log("Hotel Name" + Queries.hotel);

    //     // let insertReservation = "";
    //     // let today_date = new Date();

    //     // let month = today_date.getUTCMonth() + 1;
    //     // let day = today_date.getUTCDay();
    //     // let year = today_date.getUTCFullYear();

    //     insertReservation = `INSERT INTO booking (book_id, user_id, room_id, total_price, cancellation_charge, date_in, date_out, status)
    //                          VALUES ('9','5','10','80','8','2019-3-21','2019-3-22','booked')`;
    //     Queries.run(insertReservation).then(
    //         results =>{
    //             res.status(200).send(results)
    //         },
    //         error =>{
    //             res.status(400).send(error)
    //         }
    //     );
    //     connect.end;
    //     // // console.log("booking - SQL Query " + insertReservation);

    //     // mysql.exports(function (error, result){
    //     //     if(error) {
    //     //         console.log(error);
    //     //         res.status(200).send("Error happen, please entry again!");
    //     //     }
    //     //     else
    //     //     {
    //     //         console.log(result);
    //     //         if(result.affectedRows === 1){
    //     //             res.status(200).send("Hotel Booked Successfully on" + month + "/" + day + "/" + year);
    //     //         }
    //     //         else
    //     //         {
    //     //             res.status(200).send("Hotel Booked Failed1");
    //     //         }
    //     //     }
    //     // }, insertReservation);

    // }
    // catch (e){
    //     console.log(e);
    //     error = e;
    //     res.status(200).send("Hotel Booked Failed2");
    // }
})

//validation to ensure a room cannot be double-booked



module.exports = router;