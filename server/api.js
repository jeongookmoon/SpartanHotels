var express = require('express');
var router = express.Router();
const passport = require('./auth.js')
var Queries = require('./queries')
var mysql = require('mysql')

const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyParser = require('body-parser')

var validator = require('validator');


router.post('/register', (req,res)=>{
    console.log(req.headers)
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    const name = req.body.firstname + " " + req.body.lastname

    let q1 = mysql.format(Queries.user.create, [name, hash, req.body.email])
   // let q2 = mysql.format(Queries.user.session,[])

       Queries.run(q1).then((results) =>{
            console.log("User is created.") 
            let insertID = results.insertId
            let temp = {user_id:insertID}
            req.login(temp, function(err) {
                 console.log(req.session)
                 console.log(req.session.passport.user.user_id)
                 console.log("Session status: " + req.isAuthenticated())
                 console.log("Session successful. User logged in.")
                 res.sendStatus(200).end("Login Successful")
                 });
            //res.status(200).send(results)
        },
        (error) => {
          console.log("User could not be created.")
          console.log(error)
          if (error.errno == 1062) {
            res.setHeader("Content-Type","text/plain");
            res.statusCode = 400
            res.write("This email is already registered")
            res.end()
          }

        res.end()
        return

        })

    //    Queries.run(q2).then((results) => {
    //          //const user_id = results[0];
    //          var user_id = {user_id: results[0].user_id};
    //          console.log(user_id);

    //          if(user_id === 0) {
    //              console.log("Session unsuccessful")
    //          }
    //          else {

    //   //Currently not working. Cannot Auto-login when register account.
    //   //For some reason, session is not being created when calling req.login
            
    //          req.login(user_id, function(err) {
    //              console.log(req.session.passport.user)
    //              console.log("Session successful. User logged in.")
    //              res.end("Login Successful")
    //              });
    //          }
             

    //     },
    //     (error) => {
    //         console.log("Session Unsuccessful")
    //     })
        
    })
    
})

router.post('/login', passport.authenticate('local'), (req,res) => {
    console.log("req session passport result is ")
    console.log(req.session.passport.user)
    if(req.session.passport.user) {
        if(req.session.passport.user === "WrongPW") {
            res.end("WrongPW")    
        }
        res.end("S")
    }
    res.end("F")
    
    //res.sendStatus(200).end("Successful login.")
    //res.end("Successful login.")
    //console.log(req.session.passport.user)
})

/* Example of receiving post request, creating a query with escaping, and sending that response
// See https://github.com/mysqljs/mysql#escaping-query-values
// and https://github.com/mysqljs/mysql#preparing-queries

// To test, make a POST request to http://localhost:3001/api/test3
// with x-www-urlencoded body
//  key: name
//  value: Woof or the name of some pet in pets table
*/
router.get('/logout', authenticationMiddleware(), (req,res)=>{
    req.logout()
    console.log(req.session.cookie)
    
    res.clearCookie('connect.sid')
    req.session.destroy(function (err) {
        
        //res.redirect('/')
        console.log("Session is deleted from the database and on the client")
    })
    res.end('Logout successful')
    
})

router.get('/profile', authenticationMiddleware(), (req, res) =>{
    console.log(req.session.passport.user.user_id)
    const profile = req.session.passport.user.user_id
    let q1 = mysql.format(Queries.user.profile, [profile])

    Queries.run(q1).then((results) => {
        console.log(results)
        res.status(200).send(results)
        console.log("Profile can be viewed.")
    },
    (error) => {
        console.log("Cannot access profile.")
    })
})

//Function is used to allow certain users to access features
//Example. If not logged in, user cannot access his account page or logout.
function authenticationMiddleware() {
       return (req, res, next) => {
           console.log(`
               req.session.passport.user: ${JSON.
                   stringify(req.session.passport)}`);
           if(req.isAuthenticated()) {
               console.log('Authenticated user')
               return next();
           }
           // else not authenticated
           res.statusCode = 401
           res.write("You are not logged in")
           res.end()
       }
   }


router.get('/search/hotels', (req,res)=>{
    console.log(req.query)

    if ( typeof(req.query.date_in) == 'undefined'){
        res.status(400).send("Error: date_in missing")
        return
    }
    if ( !validator.isISO8601(req.query.date_in)){
        res.status(400).send("Error: invalid date_in specified")
        return
    }

    if ( typeof(req.query.date_out) == 'undefined'){
        res.status(400).send("Error: date_out missing")
        return
    }
    if ( !validator.isISO8601(req.query.date_out)){
        res.status(400).send("Error: invalid date_out specified")
        return
    }

    if ( typeof(req.query.rating) != 'undefined' && !validator.isInt(req.query.rating,{min:0,max:5})){
        res.status(400).send("Error: invalid rating specified")
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

router.post('/reservations/reward', (req, res)=>{
    console.log(req.body);
    let query = mysql.format(Queries.rewards.book, [req.body.user_id, req.body.room_id, req.body.reward_points, req.body.no_cancellation, req.body.date_in, req.body.date_out, req.body.status])
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

router.post('/reservations/modification', (req,res)=>{
    console.log(req.body);
    let query = mysql.format(Queries.booking.modify, [req.body.room_id, req.body.date_in, req.body.date_out, req.body.booking_id]);
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