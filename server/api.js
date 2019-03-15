var express = require('express');
var router = express.Router();
const passport = require('./auth.js')
var Queries = require('./queries')
var mysql = require('mysql')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyParser = require('body-parser')

router.post('/register', (req,res)=>{
    console.log(req.headers)
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    const name = req.body.firstname + " " + req.body.lastname

    let q1 = mysql.format(Queries.user.create, [name, hash, req.body.email])
   // let q2 = mysql.format(Queries.user.session,[])

       Queries.run(q1).then((results) =>{
            console.log("User is created.") 
            let insertID = results.insertId
            
            req.login(insertID, function(err) {
                 console.log(req.session)
                 console.log("Session status: " + req.isAuthenticated())
                 console.log("Session successful. User logged in.")
                 res.end("Login Successful")
                 });
            //res.status(200).send(results)
        },
        (error) => {
          console.log("User could not be created.")
          console.log(error)
          if (error.errno == 1062) {
            res.setHeader("Content-Type","text/plain");
            res.statusCode = 400
<<<<<<< HEAD
            res.write("This email is already registered")
            res.end()
=======
            res.end();
            //res.sendStatus(400).send(error)
>>>>>>> integration on registration/login, updated login froms
          }

        res.end()
        return

        })
<<<<<<< HEAD
       
       /**
       Queries.run(q2).then((results) => {
             //const user_id = results[0];
             var user_id = results[0]
             console.log(user_id);

             if(results[0].user_id === 0) {
                 console.log("Session unsuccessful")
             }
             else {

      //Currently not working. Cannot Auto-login when register account.
      //For some reason, session is not being created when calling req.login
             }

        },
        (error) => {
            console.log("Session Unsuccessful")
        })
       **/
=======

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
>>>>>>> integration on registration/login, updated login froms
        
    })
    
})

router.post('/login', passport.authenticate('local'), (req,res) => {
    console.log("req session passport result is ")
    console.log(req.session.passport.user)
<<<<<<< HEAD
    console.log(req.session)
=======
    if(req.session.passport.user) {
        res.end("S")
    }
    res.end("F")
    
    //res.sendStatus(200).end("Successful login.")
    //res.end("Successful login.")
    //console.log(req.session.passport.user)
>>>>>>> integration on registration/login, updated login froms
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



module.exports = router;