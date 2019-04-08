var express = require('express');
var router = express.Router();
const passport = require('./auth.js')
var Queries = require('./queries')
var Email = require('./api/email.js')
var mysql = require('mysql')
var randomstring = require('randomstring')

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

            //Send an email to registered user.
            console.log('wtf')
            var registerEmailParams = {}
            registerEmailParams.to = req.body.email
            registerEmailParams.subject = 'Welcome to Spartan Hotels!'
            registerEmailParams.text = 'Thank you for registering an account to Spartan Hotels! Start booking reservations now!'
            var sendRegisterEmail = Email.email(registerEmailParams)
            console.log(registerEmailParams)
            res.end()
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

//edit account information. Change name and password.
router.post('/edit_account', (req, res) => {
    console.log(req.headers)
    if (req.body.password === req.body.confirmpassword) {
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            const name = req.body.firstname + " " + req.body.lastname
            let editq = mysql.format(Queries.user.edit, [name, hash, req.user.user_id])
            Queries.run(editq).then((results) => {
                console.log(results)
                res.status(200).send(results)
                console.log('Account updated')
            },
            (error) => {
                console.log('An error as occurred')
            })
            res.end()
        })
    }
    else {
        res.write("Passwords do not match")
        res.end()
    }

})

//Initiate password recovery
router.post('/recovery', (req,res) => {
    console.log(req.body.email)
    var recoveryEmailParams = {};
    var accessCode = randomstring.generate(7);
    recoveryEmailParams.to = req.body.email
    recoveryEmailParams.subject = 'Password Recovery'
    recoveryEmailParams.text = 'Put in this access code to change your password: ' + accessCode;
    var sendRecoveryEmail = Email.email(recoveryEmailParams)
    console.log(JSON.stringify(recoveryEmailParams))

    //TODO: Query an UPDATE statement to update the access code into database.
    res.end()
})


//User puts in access code.
router.post('/checkcode', (req,res) => {
    
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


router.use('/reservations', require("./api/reservation"))
router.use('/search', require("./api/search"))


module.exports = router;