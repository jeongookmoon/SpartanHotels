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
                else{
                  console.log(`query result is ${JSON.stringify(results)}`)
                  resolve(results)
                } 
            })
        })
    },

    // Example queries to be used with pets db in config.js
    // Important: This means pets db must be specified in config.js, else an error will occur when query is run
    sql: `select * from pets where  age>4`,
    sql2: 'select * from pets where  name=?',


    user: {
        create:"sql statement here"
    },

    hotel: {
      /**
       * Returns [ queryWithQuestionMarks, [placeholders] ]
       * @param {*} params 
       * Required: date_in, date_out
       * Optional: city, state, zip, pageNumber, resultsPerPage
       * @param {boolean} getCount 
       * When true, the function will only return COUNT(*) of all possible results w/o regard to pagination parameters
       * Default: false
       */
        search: function (params={}, getCount=false) {
            // Example parameter: { name: "mint", category: "baby", sortByAsc: true,  priceGreaterThan: 2, priceLessThan: 5 }
            /*
              from StackOverflow, Jordan Running,
              https://stackoverflow.com/questions/31822891/how-to-build-dynamic-query-by-binding-parameters-in-node-js-sql#31823325
              
            */


            /* USING THIS
            Example of Query to see what is available:

            with 
            rb as (SELECT  B.*, R.hotel_id, R.room_number, R.price, R.bed_type, R.bed_number 
            from spartanhotel.booking B join spartanhotel.room R 
            on B.room_id = R.room_id where date_in < '2019-03-21' and date_out > '2019-03-08')
            
            select * from room 
            join hotel
            on room.hotel_id = hotel.hotel_id
            where not
            exists (select * from rb where rb.room_id = room.room_id )
            ;
            */
            
            /* NOT USING THIS, BUT HERE FOR REFERENCE
            Example of query to see which rooms not available:

            SELECT * FROM 
            ( select  B.*, R.hotel_id, R.room_number, R.price, R.bed_type, R.bed_number 
            from spartanhotel.booking B join spartanhotel.room R 
            on B.room_id = R.room_id where date_in < '2019-03-05' and date_out > '2019-03-02' and status != 'cancelled' ) as BR
            ;
            */

        
        
            // 'With clause' sets up date checking
            var dateConditions = []
            let tempTableComponent = `with 
            rb as (SELECT  B.*, R.hotel_id, R.room_number, R.price, R.bed_type, R.bed_number 
            from spartanhotel.booking B join spartanhotel.room R 
            on B.room_id = R.room_id `

             // Date Conditions
             if (typeof params.date_out !== 'undefined' && params.date_out !== '') {
              dateConditions.push(params.date_out)
            }
             if (typeof params.date_in !== 'undefined' && params.date_in !== '') {
              dateConditions.push(params.date_in)
            }
                        
            let withClause = mysql.format(tempTableComponent + "where date_in < ? and date_out > ?) ", dateConditions)


            // All other query parameters
            var conditions = [];
            var values = [];
            


            // CITY - Exact match
            if (typeof params.city !== 'undefined' && params.city !== '') {
              conditions.push("city like ?");
              values.push("" + params.city + "");
            }
            // STATE - Exact match
            if (typeof params.state !== 'undefined' && params.state !== '') {
              conditions.push("state like ?");
              values.push("" + params.state + "");
            }
            // ZIP - Exact match
            if (typeof params.zip !== 'undefined' && params.zip !== '') {
              conditions.push("zipcode = ?");
              values.push("" + params.zip + "");
            }



            
            

            // TODO: WHERE/FILTER CLAUSE
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

            // TODO: SORT BY CLAUSE
            // default 
            var sortByClause = "order by name"; 
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
            var pageNumber = 0;
            var resultsPerPage = 10;

            if (typeof params.pageNumber !== 'undefined' && params.pageNumber !== '') {
              pageNumber = params.pageNumber;
            }
            if (typeof params.resultsPerPage !== 'undefined' && params.resultsPerPage !== '') {
              resultsPerPage = params.resultsPerPage;
            }
        
            var paginationClause = "limit " + resultsPerPage + " offset " + (pageNumber * resultsPerPage)


            // PUTTING QUERY TOGETHER
            let mainQuery = ''
            if(getCount){
              mainQuery = ' SELECT COUNT(*) '
            }else{
              mainQuery = ' SELECT * '
            }

            mainQuery = mainQuery +
              `FROM
                  room
                      JOIN
                  hotel ON room.hotel_id = hotel.hotel_id
              WHERE
                  NOT EXISTS(
                    SELECT 
                          *
                      FROM
                          rb
                      WHERE
                          rb.room_id = room.room_id
                              AND rb.status != 'cancelled')
                  AND 
              `
          let query = ''
          if(getCount){
            query = withClause + mainQuery + whereClause + ';'
          }else{
            query = withClause + mainQuery + whereClause +" " + sortByClause + " " + paginationClause + ';'
          }
          
          // console.log("QUERIES.JS " + query)

          // console.log(values)
        
          return [query, values]
        
        },

    },

    room: {

    },

    booking: {

    },



}
