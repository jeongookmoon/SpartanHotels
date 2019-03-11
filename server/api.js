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
    let q2 = mysql.format(Queries.user.session,[])

       Queries.run(q1).then((results) =>{
            console.log("User is created.")
            res.status(200).send(results)
        },
        (error) => {
          console.log("User could not be created.")
          console.log(error)
          if (error.errno == 1062) {
            res.setHeader("Content-Type","text/plain");
            res.statusCode = 400
            res.write("This email already registered")
          }

        //res.end()
        //return

        })

       Queries.run(q2).then((results) => {
             const user_id = results[0].user_id;
             console.log(user_id);

             if(user_id === 0) {
                 console.log("Session unsuccessful")
             }
             else {

      //Currently not working. Cannot Auto-login when register account.
      //For some reason, session is not being created when calling req.login
             req.login(user_id, function(err) {
                 console.log(req.session)
                 console.log("Session successful. User logged in.")
                 res.end()
                 });
             }

        },
        (error) => {
            console.log("Session Unsuccessful")
        })
        
    })
    
})

router.post('/login', passport.authenticate('local'), (req,res) => {
    res.end("Successful login.")
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

    req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.redirect('/')
        console.log("Session is deleted from the database and on the client")
    })
    res.end('Logout successful')
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