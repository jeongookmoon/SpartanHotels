const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy
const mysql = require('mysql')
const bcrypt = require('bcrypt');

// const config = require('./config.js')
// const connection = mysql.createConnection(config)
const Queries = require('./queries')

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
  function (email, password, done) {
    console.log(email + ' ' + password)
    // bcrypt.hash(password, saltRounds, function(err,hash){
    //     console.log( `password is ${hash}`)

    //var fixedLengthOfPassword = 60
    //var hash = password + Array(fixedLengthOfPassword - password.length + 1).join('\x00')
    let q = mysql.format(Queries.user.authenticate, [email])
    console.log(`Final query: ${q}`)
    Queries.run(q)
      .then((result) => {
        
        if (result.length > 0) {
          console.log(result[0].password.toString());
          const hash = result[0].password.toString();
          bcrypt.compare(password, hash, function(err, response) {
            if(response === true) {
              return done(null, {user_id: result[0].id});
            }
            else {
              return done(null, false);
            }
          });

        } else {
          return done(null, false);
        }
      })
  })
)

passport.serializeUser(function (user_id, done) {
  done(null, user_id)
})

passport.deserializeUser(function (user_id, done) {
  done(null, user_id)
})

module.exports = passport
