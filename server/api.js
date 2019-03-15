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
    
})

//Make a reservation 
router.post('/reservation', (req, res)=>{
    let response = {
        status: 400
    }
    

    try{
        console("In api.js/reservation");
        console.log("Hotel Name" + Queries.hotel);

        let insertReservation = "";
        let date_today = new Date();

        let month = today_date.getUTCMonth() + 1;
        let day = today_date.getUTCDay();
        let year = today_date.getUTCFullYear();

        insertReservation = "insert into booking (book_id, user_id, room_id, total_price, cancellation_charge, date_in, date_out, status)" +
        "values ('"+ req.book_id +"','"+ req.user_id +"','"+ req.room_id +"','"+ req.total_price +"','"+ req.cancellation_charge +"','"+ req.date_in +"','"+ req.date_out +"','"+ req.status +"');";

        console.log("booking - SQL Query " + insertReservation);

        mysql.insertData(function (error, result){
            if(error) {
                console.log(error);
                res(error, null);
            }
            else
            {
                console.log(result);
                if(result.affectedRows === 1){
                    response.status = 200;
                    response.message = "Hotel Booked Successfully on" + month + "/" + day + "/" + year;
                    res(null, response);
                }
                else
                {
                    response.status = 400;
                    response.message = "Hotel Booked Failed";
                    res(null, response);
                }
            }
        }, insertReservation);

    }
    catch (e){
        console.log(e);
        error = e;
        response.status = 401;
        response.message = "Hotel Booked Failed";
        res(error, response);
    }
})

//validation to ensure a room cannot be double-booked



module.exports = router;