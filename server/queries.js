const mysql = require('mysql')
const config = require('./sql/config.js')

var connection = mysql.createConnection(config)

//TODO: Might be necessary when hosting on Heroku, if not can delete
/*
var connection;
function handleDisconnect() {
    connection = mysql.createConnection(config);  // Recreate the connection, since the old one cannot be reused.
    connection.connect( function onConnect(err) {   // The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
        }                                           // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
                                                    // If you're also serving http, display a 503 error.
    connection.on('error', function onError(err) {
        console.log('Connection lost. :(');
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            handleDisconnect();    
            console.log('Another connection is created. :)')                     // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();
*/

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
        profile: 'select name, email, reward from spartanhotel.user where user_id=?',
        checkEmailExists: 'select * from user where email=?',
        checkUserNameExists: 'select user_id from spartanhotel.user where name=?',
        create: 'insert into spartanhotel.user (user_id,name,password,email) values (null,?,?,?)',
        session: 'select LAST_INSERT_ID() as user_id ',
        authenticate: 'select user_id, password from spartanhotel.user where email=?',
        getAvailableRewards: 'SELECT sum(R.change) as sum FROM spartanhotel.reward R where user_id=? and date_active <= curdate();'
    },

    hotel: {
      /**
       * Returns [ queryWithQuestionMarks, [placeholders] ]
       * @param {*} params 
       * Required: date_in, date_out
       * Optional: city, state, zip, pageNumber, resultsPerPage
       * @param {boolean} getCount 
       * When true, the resulting query will only return COUNT(*) of all possible results w/o regard to pagination parameters
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
            exists (select * from rb where rb.room_id = room.room_id AND rb.status != 'cancelled')
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



            
            

            // WHERE/FILTER CLAUSE
            // TODO: filter by distance
            if (typeof params.amenities !== 'undefined'){
              let amenities = JSON.parse(decodeURIComponent(params.amenities))
              for(var i=0;i< amenities.length;i++){
                conditions.push(" amenities like ? ");
                values.push("%" + amenities[i] + "%");
              }


            }

            if (typeof params.rating !== 'undefined'){
              let rating = parseInt(params.rating)
              conditions.push(" rating = ? ");
              values.push(rating);
            }


            if (typeof params.priceGTE !== 'undefined' && params.priceGTE !== '') {
              conditions.push("price >= ?");
              values.push(params.priceGTE);
            }
        
            if (typeof params.priceLTE !== 'undefined' && params.priceLTE !== '') {
              conditions.push("price <= ?");
              values.push(params.priceLTE);
            }
        

        
            var whereClause = conditions.length ? conditions.join(' AND ') : '1'

            // SORT BY CLAUSE
            // TODO: sort by distance
            var sortByClause = " order by name "; 
            if (typeof params.sortBy !== 'undefined' && params.sortBy !== '') {
              switch (params.sortBy) {
                case ("rating_asc"):
                  sortByClause = " order by rating ";
                  break
                case ("rating_des"):
                  sortByClause = " order by rating desc "
                  break
                case ("name_asc"):
                  sortByClause = " order by name ";
                  break
                case("name_des"):
                  sortByClause = " order by name desc ";
                  break
                case("price_asc"):
                  sortByClause = " order by min_price ";
                  break
                case("price_des"):
                  sortByClause = " order by min_price desc ";
                  break
                default:
                  sortByClause = " order by name "
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
        

            var paginationClause = " limit " + resultsPerPage + " offset " + (pageNumber * resultsPerPage) + " "


            // PUTTING QUERY TOGETHER
            let mainQuery = ''
            if(getCount){
              mainQuery = ` SELECT COUNT( distinct hotel.hotel_id ) as count `
            }else{
              mainQuery = ' SELECT  distinct hotel.*, min(price) as min_price, max(price) as max_price, count(room_id) as rooms_available '
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
          let groupByClause = ' group by room.hotel_id '
          if(getCount){
            query = withClause + mainQuery + whereClause + ';'
          }else{
            // wrap query inside a select so we can join the results with hotel images
            query = ` select rh.*, group_concat(url) as images from ( ` + 
              withClause + mainQuery + whereClause + groupByClause + 
              `
                ) as rh
                left join
                hotel_image
                on hotel_image.hotel_id = rh.hotel_id
                group by
                rh.hotel_id
              `
              + sortByClause + paginationClause  + 
              ';'
          }
          
          // console.log("QUERIES.JS " + query)

          // console.log(values)
        
          return [query, values]
        
        },
        room: function (params = {}, queryString={}, getCount=false) {
          // Example parameter: { name: "mint", category: "baby", sortByAsc: true,  priceGreaterThan: 2, priceLessThan: 5 }
          /*
            from StackOverflow, Jordan Running,
            https://stackoverflow.com/questions/31822891/how-to-build-dynamic-query-by-binding-parameters-in-node-js-sql#31823325
            
          */
      
          // 'With clause' sets up date checking for available rooms at specific hotel
          // 'With clause' results in a table of rooms booked during the given time at the given hotel
          var withConditions = []
          let tempTableComponent = `with 
          rb as (SELECT  B.*, R.hotel_id, R.room_number, R.price, R.bed_type, R.bed_number 
          from spartanhotel.booking B join spartanhotel.room R 
          on B.room_id = R.room_id `
      
           // Date Conditions
           if (typeof queryString.date_out !== 'undefined' && queryString.date_out !== '') {
            withConditions.push(queryString.date_out)
          }
           if (typeof queryString.date_in !== 'undefined' && queryString.date_in !== '') {
            withConditions.push(queryString.date_in)
          }
          // Specific Hotel
          if (typeof params.hotelID !== 'undefined' && params.hotelID !== '') {
            withConditions.push(params.hotelID)
          }
                     
          let withClause = mysql.format(tempTableComponent + "where date_in < ? and date_out > ? and hotel_id = ?) ", withConditions)
      
      
          // All other query parameters
          var conditions = [];
          var values = [];
      
          // WHERE/FILTER CLAUSE
      
          // Useful only if rooms have different amenities and ratings
          // if (typeof queryString.amenities !== 'undefined'){
          //   let amenities = JSON.parse(decodeURIComponent(queryString.amenities))
          //   for(var i=0;i< amenities.length;i++){
          //     conditions.push(" amenities like ? ");
          //     values.push("%" + amenities[i] + "%");
          //   }
          // }
          // if (typeof params.rating !== 'undefined'){
          //   let rating = parseInt(params.rating)
          //   conditions.push(" rating = ? ");
          //   values.push(rating);
          // }
      
      
          if (typeof queryString.priceGTE !== 'undefined' && queryString.priceGTE !== '') {
            conditions.push("price >= ?");
            values.push(queryString.priceGTE);
          }
      
          if (typeof queryString.priceLTE !== 'undefined' && queryString.priceLTE !== '') {
            conditions.push("price <= ?");
            values.push(queryString.priceLTE);
          }
      
          conditions.push("hotel_id = ?")
          values.push(params.hotelID)
      
      
      
          var whereClause = conditions.length ? conditions.join(' AND ') : '1'
             
          // SORT BY CLAUSE
            // TODO: sort by distance
            var sortByClause = ""; 
            if (typeof queryString.sortBy !== 'undefined' && queryString.sortBy !== '') {
              switch (queryString.sortBy) {
              // Useful only if rooms have different amenities and ratings
              // case ("rating_asc"):
              //   sortByClause = " order by rating ";
              //   break
              // case ("rating_des"):
              //   sortByClause = " order by rating desc "
              //   break
                case ("name_asc"):
                  sortByClause = " order by name ";
                  break
                case("name_des"):
                  sortByClause = " order by name desc ";
                  break
                case("price_asc"):
                  sortByClause = " order by price ";
                  break
                case("price_des"):
                  sortByClause = " order by price desc ";
                  break
                default:
                  sortByClause = " order by price desc "
              }
            }
      
          // PAGINATION
          var pageNumber = 0;
          var resultsPerPage = 10;
      
          if (typeof queryString.pageNumber !== 'undefined' && queryString.pageNumber !== '') {
            pageNumber = queryString.pageNumber;
          }
          if (typeof queryString.resultsPerPage !== 'undefined' && queryString.resultsPerPage !== '') {
            resultsPerPage = queryString.resultsPerPage;
          }
      
          var paginationClause = " limit " + resultsPerPage + " offset " + (pageNumber * resultsPerPage) + " "
      
      
          // PUTTING QUERY TOGETHER
          let mainQuery = ''
          if(getCount){
            mainQuery = ` SELECT COUNT( * ) as count `
          }else{
            mainQuery = ' SELECT  * '
          }
          mainQuery = mainQuery +
            `FROM
                room
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
          // wrap query inside a select so we can join the results with hotel images
          query = ` select rh.*, group_concat(url) as images from ( ` + 
          withClause + mainQuery + whereClause + 
          `
            ) as rh
            left join
            room_image
            on room_image.hotel_id = rh.hotel_id and room_image.bed_type = rh.bed_type and room_image.bed_number = rh.bed_number
            group by
            rh.room_id
          `
          + sortByClause + paginationClause  + 
          ';'
        }
        return [query, values]
      },

    },


    booking: {
    book: 'INSERT INTO spartanhotel.booking(booking_id, user_id, guest_id, room_id, total_price, cancellation_charge, date_in, date_out, status, amount_paid) values (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    cancel: 'UPDATE booking SET status="cancelled" WHERE booking_id=?',
    modify: 'UPDATE booking SET status="modified" room_id=?, date_in=?, date_out=? WHERE booking_id=?',
    user_id: 'SELECT * FROM booking WHERE booking_id=?',

    //When query is ran -> returns an array that cannot be cancelled, else returns an empty array which means can be cancelled
    isCancellable: function({booking_id}) {
      let query = `SELECT * FROM spartanhotel.booking WHERE
                    booking_id = ? AND date_in <= CURDATE() AND date_out >= CURDATE() AND status != 'cancelled';`

      return mysql.format(query, [booking_id])
    },

    //When ran -> returns an array that cannot be MODIFIED, else returns an empty array 
    //meaning the booking can be modified
    isModifiable: function({booking_id}) {
      let query = `SELECT * FROM spartanhotel.booking WHERE
                    booking_id = ? 
                    AND date_in <= CURDATE() 
                    AND date_out >= CURDATE() 
                    AND status != 'cancelled'
                    AND status != 'modified';`

      return mysql.format(query, [booking_id])
    },

    // When ran -> returns an array with the selected result(s), else array is empty and isBookable is
    // ran for modifyAvailabilityCheck in reservation.js
    isOldBookingIdAndRoomId: function({booking_id, room_id}) {
      let query = `SELECT * FROM spartanhotel.booking WHERE
                    booking_id = ? 
                    AND room_id = ?  
                    AND status = 'booked';`

      return mysql.format(query, [booking_id, room_id])
    },

    /**
     * 
     * @param {*} user_id 
     * @param {*} date_in 
     * @param {*} date_out 
     * @returns A query, which when run -> returns an array of bookings which conflict with the given inputs, else returns empty array
     */
      duplicateBookingCheck: function({user_id, date_in, date_out}){
        let query = `
        SELECT 
          B.*,
          R.hotel_id,
          R.room_number,
          R.price,
          R.bed_type,
          R.bed_number
        FROM
            spartanhotel.booking B
                JOIN
            spartanhotel.room R ON B.room_id = R.room_id
        WHERE
            date_in < ?
                AND date_out > ?
                AND user_id = ?
                AND status != 'cancelled'          
        ;
        `
        return mysql.format(query, [date_out, date_in, user_id])
      },

      /**
     * 
     * @param {*} params 
     * {date_in, date_out, room_id}
     * @returns {*} 
     * 
     * This returns a query, that when run, will:
     * 
     * Return an array containing an object
     * eg
     * [{"available":1,"room_id":9,"hotel_id":5,"room_number":210,"price":138.46,"bed_type":"King","bed_number":1}]
     * available is false if = 0
     * 
     * Else, returns an error message
     * 
      */
    isBookable: function(params = {}){
      let query = `
      SELECT 
      *
      FROM
          (SELECT 
              NOT EXISTS( SELECT 
                          *
                      FROM
                          spartanhotel.booking B
                      JOIN spartanhotel.room R ON B.room_id = R.room_id
                      WHERE
                          date_in < ?
                              AND date_out > ?
                              AND status != 'cancelled'
                              AND R.room_id = ?) AS available
          ) AS availability
              JOIN
          spartanhotel.room
      WHERE
          room_id = ?
      ;
      
      `

      let values = [];
      if (typeof params.date_out !== 'undefined' && params.date_out !== '') {
        values.push(params.date_out)
      }
      if (typeof params.date_in !== 'undefined' && params.date_in !== '') {
        values.push(params.date_in)
      }
      if (typeof params.room_id !== 'undefined' && params.room_id !== '') {
        values.push(params.room_id)
        values.push(params.room_id)
      }
      let sql = mysql.format(query, values)
      console.log(sql)

      return sql
    }

  },

    rewards: {

      book: 'INSERT INTO spartanhotel.rewards(reward_book_id, user_id, room_id, reward_points, no_cancellation, date_in, date_out, status) values (null, ?, ?, ?, ?, ?, ?, ?)',
      book: 'INSERT INTO spartanhotel.rewards (reward_book_id, user_id, room_id, reward_points, no_cancellation, date_in, date_out, status) values (null, ?, ?, ?, ?, ?, ?, ?)',
      useOnBooking: 'INSERT INTO spartanhotel.reward (reward_id, user_id, reward_reason_id, booking_id, date_active, `change`) values (null, ?, 1, ?, curdate(), ?)',
      gainFromBooking: 'INSERT INTO spartanhotel.reward (reward_id, user_id, reward_reason_id, booking_id, date_active, `change`) values (null, ?, 2, ?, ?, ?)',
      getUserRecords: 'SELECT R.*,RR.reason FROM spartanhotel.reward R join spartanhotel.reward_reason RR on R.reward_reason_id = RR.reward_reason_id WHERE user_id=?',
      cancelBooking: 'DELETE from spartanhotel.reward where booking_id=?',
      getOldBookingAppliedRewards: 'SELECT R.change FROM spartanhotel.reward R WHERE booking_id = ? AND SIGN(change) = -1'
    },

    guest: {
      insert: 'INSERT INTO spartanhotel.guest(guest_id, email, name) values (null, ?, ?)'

    }



}
