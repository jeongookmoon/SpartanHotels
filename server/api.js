var express = require('express');
var router = express.Router();
const passport = require('./auth.js')
var Queries = require('./queries')
var Email = require('./api/email.js')
var mysql = require('mysql')
var randomstring = require('randomstring')
var reservationapi = require('./api/reservation.js')

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

// Updated to retrieve the new rewards for profile
router.get('/profile', authenticationMiddleware(), (req, res) =>{
    console.log(req.session.passport.user.user_id)
    const profile = req.session.passport.user.user_id
    let q1 = mysql.format(Queries.user.profile, [profile])

    Queries.run(q1).then((results) => {
        console.log(results[0])
        console.log("Profile can be viewed.")
        let q2 = mysql.format(Queries.user.getAvailableRewards, [profile])
        Queries.run(q2).then((results2) => {
            console.log(results2[0])
            
            results[0].reward = results2[0].rewards
            res.status(200).send(results[0])
            console.log("Here are the user's rewards")
        },
        (error) => {
            console.log("Cannot get user's rewards")
        })
    },
    (error) => {
        console.log("Cannot access profile.")
    })
})

//edit account information. Change name and password.
router.post('/edit_account', authenticationMiddleware(), (req, res) => {
    console.log(req.headers)
    if (req.body.password === req.body.confirmpassword) {
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            const name = req.body.firstname + " " + req.body.lastname
            let editq = mysql.format(Queries.user.edit, [name, hash, req.session.passport.user.user_id])
            Queries.run(editq).then((results) => {
                console.log(results)
                res.status(200).send('Account Updated')
            },
            (error) => {
                console.log('An error as occurred')
                res.status(400).send(error)
            })
        })
    }
    else {
        res.status(400).send('Passwords do not match')
    }

})

//Initiate password recovery
router.post('/recovery', (req,res) => {
    console.log(req.body.email)
    
    //Send an email generating a random string that contains the access code.
    var recoveryEmailParams = {};
    var accessCode = randomstring.generate(7);
    recoveryEmailParams.to = req.body.email
    recoveryEmailParams.subject = 'Password Recovery'
    recoveryEmailParams.text = 'Put in this access code to change your password: ' + accessCode;

    //Search if the email exists
    let emailSearch = mysql.format(Queries.user.searchEmail, [req.body.email])
    Queries.run(emailSearch).then((results) => {
        if (results == '') {
            res.status(400).send('Email not registered')
        }
        else {
            var sendRecoveryEmail = Email.email(recoveryEmailParams)
            res.status(200).send('Recovery email sent')
        }
    },
    (error) => {
        console.log('Query failed')
        res.status(400).send(error)
    })
    console.log(JSON.stringify(recoveryEmailParams))

    //Query an UPDATE statement to update the access code into database.
    let updateAccessCode = mysql.format(Queries.user.setAccessCode, [accessCode, req.body.email])
    Queries.run(updateAccessCode).then((results) => {
        console.log(results)
        console.log('Access Code Updated')
    },
    (error) => {
        console.log('An Error has occurred')
        res.status(400).send(error)
    })
    //res.end('Recovery Email Sent')
})


//User puts in access code.
router.post('/checkcode', (req,res) => {
    console.log(req.body.access_code)
    let getCodeQuery = mysql.format(Queries.user.getAccessCode, [req.body.email])
    Queries.run(getCodeQuery).then((results) => {
        console.log(results)
        //res.status(200).send(results)
        console.log('This is the access code: '+ results[0].access_code.toString())
        if (req.body.access_code == results[0].access_code.toString()) {
            res.status(200).send('Code Accepted')
        }
        else {
            res.status(400).send('Invalid Code')
        }
    },
    (error) => {
        console.log('An Error has occurred')
        res.status(400).send(error)
    })
    
})

//Different logic for editing account. This request gets sent after user enters their access code and needs to change their password. System knows
//which row to update based user's email.
router.post('/changepass', (req,res) => {
    console.log(req.body.email)
    if (req.body.password === req.body.confirmpassword) {
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            let change_pass_query = mysql.format(Queries.user.changepass, [hash, req.body.email])
            Queries.run(change_pass_query).then((results) => {
                console.log(results)
                res.status(200).send('Password changed')
            },
            (error) => {
                console.log('An error as occurred')
                res.status(400).send(error)
            })
        })
    }
    else {
        res.status(400).send('Passwords do not match')
    }
})
    
// Retrieves the user's total amount of rewards for checkout to check
router.get('/rewards', authenticationMiddleware(), (req, res) =>{
    console.log(req.session.passport.user.user_id)
    const profile = req.session.passport.user.user_id
    let q1 = mysql.format(Queries.user.getAvailableRewards, [profile])

    Queries.run(q1).then((results) => {
        console.log(results[0])
        res.status(200).send(results[0])
        console.log("Here are the user's rewards")
    },
    (error) => {
        console.log("Cannot get user's rewards")
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





// TODO: Update to v0.2
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