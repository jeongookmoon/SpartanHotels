const mysql = require('mysql')
const config = require('./sql/config.js')

var connection = mysql.createConnection(config)

module.exports = {

    /**
    * Returns the result of a sql query as a promise.
    * onPromiseSuccess is function callback that is run on successful promise
    * onPromiseFailure is function callback that is run when promise failed
    * The name and parameter name for these callback functions does not matter.
    *
    * Example of use:
    *
    * var queryPromise = queryResultPromiser(some_query)
    * .then(
    *  function onPromiseSuccess(value_returned_when_promise_successful){
    *      // do stuff
    *  },
    *  function onPromiseFailure(value_returned_when_promise_failed){
    *      // do stuff
    *  }
    * )
    *
    * @param {query} query
    */
    run: function queryResultPromiser(query) {
        return new Promise((resolve, reject) => {
            connection.query(query, (error, results, fields) => {
                console.log('query being processed')
                if (error) {
                    // return console.error(error.message)
                    reject(error)
                }
                console.log(`query result is ${JSON.stringify(results)}`)
                resolve(results)
            })
        })
    },

    // Example queries to be used with pets db in config.js
    sql: `select * from pets where  age>4`,
    sql2: 'select * from pets where  name=?',


    user: {
        create:"sql statement here"
    },

    hotel: {
        search: function (params={}) {
            // Example parameter: { name: "mint", category: "baby", sortByAsc: true,  priceGreaterThan: 2, priceLessThan: 5 }
            /*
              from StackOverflow, Jordan Running,
              https://stackoverflow.com/questions/31822891/how-to-build-dynamic-query-by-binding-parameters-in-node-js-sql#31823325
              
            */
            // console.log(params)
        
            const sql = "select * from product"
        
            var conditions = [];
            var values = [];
            // default values
            var sortByClause = "order by name";
            var pageNumber = 0;
            var resultsPerPage = 10;
        
            // WHERE/FILTER CLAUSE
            if (typeof params.searchTerm !== 'undefined' && params.searchTerm !== '') {
              conditions.push("name like ?");
              values.push("%" + params.searchTerm + "%");
            }
        
            if (typeof params.category !== 'undefined' && params.category !== '') {
              conditions.push("category like ?");
              values.push("%" + params.category + "%");
            }
        
            if (typeof params.priceGreaterThan !== 'undefined' && params.priceGreaterThan !== '') {
              conditions.push("price > ?");
              values.push(params.priceGreaterThan);
            }
        
            if (typeof params.priceLessThan !== 'undefined' && params.priceLessThan !== '') {
              conditions.push("price < ?");
              values.push(params.priceLessThan);
            }
        
            var whereClause = conditions.length ? conditions.join(' AND ') : '1'

            // SORT BY CLAUSE
            if (typeof params.sortBy !== 'undefined' && params.sortBy !== '') {
              switch (params.sortBy) {
                case ("Price Ascending"):
                  sortByClause = "order by price";
                  break
                case ("Price Descending"):
                  sortByClause = "order by price desc"
                  break
                case ("Name Ascending"):
                sortByClause = "order by name";
                break
                case("Name Descending"):
                sortByClause = "order by name desc";
                break
                case("Category Ascending"):
                sortByClause = "order by category";
                break
                case("Category Descending"):
                sortByClause = "order by category desc";
                break
              }
            }
        
            // PAGINATION
            if (typeof params.pageNumber !== 'undefined' && params.pageNumber !== '') {
              pageNumber = params.pageNumber;
            }
            if (typeof params.resultsPerPage !== 'undefined' && params.resultsPerPage !== '') {
              resultsPerPage = params.resultsPerPage;
            }
        
            var paginationClause = "limit " + resultsPerPage + " offset " + (pageNumber * resultsPerPage)
        
            // PUTTING QUERY TOGETHER
        
        
            console.log(whereClause + " " + sortByClause + " " + paginationClause)
            consnole.log(values)
        
            return [sql + " where " + whereClause + " " + sortByClause + " " + paginationClause, values]
        
        },

    },

    room: {

    },

    booking: {
    book: 'INSERT INTO spartanhotel.booking(booking_id, user_id, room_id, total_price, cancellation_charge, date_in, date_out, status) values (null, ?, ?, ?, ?, ?, ?, ?)',
    cancel: 'UPDATE spartanhotel SET status=cancelled WHERE booking_id=?',
    modify: 'UPDATE booking SET room_id=?, date_in=?, date_out=? WHERE booking_id=?'
    },



}
