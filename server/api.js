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


router.get('/search/hotels', (req,res)=>{
    console.log(req.query)
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
            
            res.status(200).send({results, totalResultCount})
        }
    )
    .catch(
        error =>{
            console.log(error)
            res.status(400).send("bad")
        }
    )


    
    // Queries.run(countQuery).then(
    //     results=>{
    //         console.log("GGG")
    //         console.log(results)
    //     },
    //     error =>{
    //         console.log(error)
            
    //     }
    // )
    // Queries.run(fullQuery).then(
    //     results=>{
    //         console.log(results)
    //     },
    //     error =>{
    //         console.log(error)
            
    //     }
    // )
        

    // Queries.run(fullQuery).then(
    //     results=>{
    //         res.status(200).send(results)
    //     },
    //     error =>{
    //         console.log(error)
    //         res.status(400).send("bad")
    //     }
    // )

    
})


router.get('/search/hotels', (req,res)=>{
    console.log(req.query)
})



module.exports = router;