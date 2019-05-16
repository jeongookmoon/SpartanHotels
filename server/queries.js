const mysql = require('mysql')
const config = require('./sql/config.js')
const convertStatesCode = require('./utility/statesCode')

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
  connection: connection,

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
        else {
          // console.log(`query result is ${JSON.stringify(results)}`)
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
        getAvailableRewardsIgnoringTransaction: 'SELECT sum(R.change) as sum FROM spartanhotel.reward R where user_id=? and date_active <= curdate() and (transaction_id != ? or transaction_id is NULL);',
        getBookingForTransaction:'SELECT * FROM spartanhotel.booking WHERE transaction_id=?',
        edit: 'UPDATE user SET name=?, password=? WHERE user_id=?',
        changepass: 'UPDATE user SET password = ? WHERE email = ?',
        searchEmail: 'SELECT * FROM user WHERE email = ?',
        getEmailwithID: 'SELECT email FROM user WHERE user_id = ?',
        getAccessCode: 'SELECT access_code FROM user WHERE email = ?',
        setAccessCode: 'UPDATE user SET access_code = ? WHERE email = ?',
        getAvailableRewards: 'SELECT sum(R.change) as rewards FROM spartanhotel.reward R where user_id=? and date_active <= curdate()',
        userProfileChangePass: 'UPDATE user SET password = ? WHERE user_id = ?',
        getOldPass: 'SELECT password FROM user where user_id =?',
        setNewName: 'UPDATE user SET name=? WHERE user_id=?'
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
    search: function (params = {}, getCount = false) {
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
      on room.hotel_id = hotel.hotel_id {AND hotel.hotel_id = ?}
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
            rb as (SELECT  B.*, R.hotel_id, R.room_number, R.price, R.bed_type
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
        values.push("" + convertStatesCode(params.state) + "");
      }
      // ZIP - Exact match
      if (typeof params.zip !== 'undefined' && params.zip !== '') {
        conditions.push("zipcode = ?");
        values.push("" + params.zip + "");
      }






      // WHERE/FILTER CLAUSE
      // TODO: filter by distance
      if (typeof params.amenities !== 'undefined') {
        const amenities = params.amenities
        const isAmenitiesArray = amenities.split(",")
        if (isAmenitiesArray && isAmenitiesArray.constructor === Array) {
          isAmenitiesArray.forEach((eachAmenity) => {
            conditions.push(" amenities like ? ")
            values.push("%" + eachAmenity + "%")
          })
        } else {
          conditions.push(" amenities like ? ");
          values.push("%" + amenities + "%");
        }
      }

      if (typeof params.rating !== 'undefined') {
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
      let sortByClause = ''
      if (typeof params.latitude !== 'undefined' && params.latitude !== '' && typeof params.longitude !== 'undefined' && params.longitude !== '')
        sortByClause = ` order by (POW((${params.latitude}-latitude),2) + POW((${params.longitude}-longitude),2)) asc `

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
          case ("name_des"):
            sortByClause = " order by name desc ";
            break
          case ("price_asc"):
            sortByClause = " order by min_price ";
            break
          case ("price_des"):
            sortByClause = " order by min_price desc ";
            break
          case ("distance_asc"):
            if (typeof params.latitude !== 'undefined' && params.latitude !== '' && typeof params.longitude !== 'undefined' && params.longitude !== '')
              sortByClause = ` order by (POW((${params.latitude}-latitude),2) + POW((${params.longitude}-longitude),2)) asc`;
            break
          case ("distance_des"):
            if (typeof params.latitude !== 'undefined' && params.latitude !== '' && typeof params.longitude !== 'undefined' && params.longitude !== '')
              sortByClause = ` order by (POW((${params.latitude}-latitude),2) + POW((${params.longitude}-longitude),2)) desc`;
            break
          default:
            sortByClause = " order by name ";
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
      if (getCount) {
        mainQuery = ` SELECT COUNT( distinct hotel.hotel_id ) as count `
      } else {
        mainQuery = ' SELECT  distinct hotel.*, min(price) as min_price, max(price) as max_price, count(room_id) as rooms_available '
      }

      if (typeof params.priceLTE !== 'undefined' && params.priceLTE !== '') {
        conditions.push("price <= ?");
        values.push(params.priceLTE);
      }

      let hotelIDClause = ""
      if (typeof params.hotel_id !== 'undefined' && params.hotel_id !== '') {
        let hotelIDComponent = " AND hotel.hotel_id = ?"
        hotelIDClause = mysql.format(hotelIDComponent, params.hotel_id)
      }

      mainQuery = mainQuery +
        `FROM
                  room
                      JOIN
                  hotel ON room.hotel_id = hotel.hotel_id` + hotelIDClause + `
              
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
      if (getCount) {
        query = withClause + mainQuery + whereClause + ';'
      } else {
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
          + sortByClause + paginationClause +
          ';'
      }

      // console.log("QUERIES.JS " + query)

      // console.log(values)

      return [query, values]

    },

    /**
     * \* on parameter component means optional
     * @param {Object} params
     * @param {Number} params.hotelID 
     * @param {Object} queryString {date_in, date_out, price_GTE\*, price_LTE\*, sortBy\*, pageNumber\*, resultsPerPage\*}
     * @param {Date} queryString.date_in
     * @param {Date} queryString.date_out
     * @param {Number} [queryString.price_GTE]
     * @param {Number} [queryString.price_LTE]
     * @param {string} [queryString.sortBy]
     * @param {Number} [queryString.pageNumber = 0]
     * @param {Number} [queryString.resultsPerPage=10]
     * sortBy can be name_asc, name_des, price_asc, price_des; Default is price_asc
     * 
     * pageNumber; Default is 0
     * 
     * resultsPerPage; Default is 10
     * 
     * @param {Boolean} [getCount=false] 
     */
    room: function (params, queryString, getCount = false) {
      // Example parameter: { name: "mint", category: "baby", sortByAsc: true,  priceGreaterThan: 2, priceLessThan: 5 }
      /*
        from StackOverflow, Jordan Running,
        https://stackoverflow.com/questions/31822891/how-to-build-dynamic-query-by-binding-parameters-in-node-js-sql#31823325
        
      */

      // 'With clause' sets up date checking for available rooms at specific hotel
      // 'With clause' results in a table of rooms booked during the given time at the given hotel
      var withConditions = []
      let tempTableComponent = `with 
          rb as (SELECT  B.*, R.hotel_id, R.room_number, R.price, R.bed_type
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
          case ("name_des"):
            sortByClause = " order by name desc ";
            break
          case ("price_asc"):
            sortByClause = " order by price ";
            break
          case ("price_des"):
            sortByClause = " order by price desc ";
            break
          default:
            sortByClause = " order by price "
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
      let mainQuery =
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

      if (getCount) {
        query = withClause + ` 
          SELECT  count(*) as count 
          FROM 
            (select count(*) as count 
          `
          + mainQuery + whereClause +
          `
            group by bed_type, price) 
          as a 
          `
          + ';'
      } else {
        // wrap query inside a select so we can join the results with hotel images
        query = withClause + ` 
          SELECT  rh.hotel_id, rh.bed_type, rh.price, ANY_VALUE(rh.capacity) as capacity, group_concat( distinct(url) ) as images, count(room_id) as quantity, group_concat(room_id) as room_ids 
          FROM 
            (select * ` +
          mainQuery + whereClause +
          `
            ) 
            as rh
            left join
            room_image
            on room_image.hotel_id = rh.hotel_id and room_image.bed_type = rh.bed_type
            group by
            bed_type, price
          `
          + sortByClause + paginationClause +
          ';'
      }
      return [query, values]
    },

  },


  booking: {

    book: 'INSERT INTO spartanhotel.booking(booking_id, user_id, guest_id, room_id, total_price, cancellation_charge, date_in, date_out, status, amount_paid) values (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    cancel: 'UPDATE booking SET status="cancelled" WHERE booking_id=?',
    modify: 'UPDATE booking SET room_id=?, date_in=?, date_out=? WHERE booking_id=?',
    view: `SELECT transaction.*, room.*, hotel.name
    FROM transaction 
    LEFT JOIN transaction_room ON transaction.transaction_id = transaction_room.transaction_id 
    LEFT JOIN room ON transaction_room.room_id = room.room_id
    LEFT JOIN hotel ON room.hotel_id = hotel.hotel_id 
    WHERE transaction.user_id = ?
    ORDER BY status ASC`,

    /**
     * 
     * @returns placeholder query to insert into transaction table
     */
    makeTransaction: 'INSERT INTO spartanhotel.transaction(transaction_id, user_id, guest_id, total_price, cancellation_charge, date_in, date_out, status, amount_paid, stripe_id) values (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)',

    /**
     * Insert into transaction_room table
     * @param {Number} transaction_id 
     * @param {Object[]} rooms_booked 
     * @param {string} rooms_booked[].bed_type
     * @param {Number} rooms_booked[].price
     * @param {Number} rooms_booked[].desired_quantity
     * @param {Number[]} rooms_booked[].room_ids
     * @returns A formatted query ie "INSERT INTO spartanhotel.transaction_room(transaction_id, room_id, room_price) VALUES (39,10,20),(39,11,65)"
     */
    makeTransactionDetails: function (transaction_id, rooms_booked) {
      let insertStatement = "INSERT INTO spartanhotel.transaction_room(transaction_id, room_id, room_price) VALUES "
      let placeholders = []
      let values = []
      for (i = 0; i < rooms_booked.length; i++) {
        for (j = 0; j < rooms_booked[i].desired_quantity; j++) {
          placeholders.push("(?,?,?)")
          values.push(transaction_id)
          if(Array.isArray(rooms_booked[i].room_ids)){
            values.push(rooms_booked[i].room_ids[j])
            values.push(rooms_booked[i].price)
          } else {
            var room_id_array = JSON.parse("[" + rooms_booked[i].room_ids + "]");
            values.push(room_id_array[j])
            values.push(rooms_booked[i].price)
          }          
        }

      }
      let placeholderComponent = placeholders.join(",")
      return mysql.format(insertStatement + placeholderComponent, values)
    },
    book: 'INSERT INTO spartanhotel.booking(booking_id, user_id, guest_id, room_id, total_price, cancellation_charge, date_in, date_out, status, amount_paid) values (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    cancel: 'UPDATE booking SET status="cancelled" WHERE booking_id=?',
    modify: 'UPDATE booking SET room_id=?, date_in=?, date_out=? WHERE booking_id=?',
    removeTransactionRoomDataForTransaction: '',

    //For when the user cancels the entire transaction
    cancel_transaction: 'UPDATE spartanhotel.transaction SET status="cancelled" WHERE transaction_id=?',
    cancel_all: 'DELETE from spartanhotel.transaction_room where transaction_id=?',
    // For when the user cancels only a single room
    cancel_one: 'DELETE from spartanhotel.transaction_room where transaction_id=? AND room_id=?',
    cancel_one_room: 'UPDATE spartanhotel.transaction SET total_price=?, cancellation_charge=?, amount_paid=? WHERE transaction_id=?',
    user_id: 'SELECT * FROM transaction WHERE transaction_id=?',
    room_price: 'SELECT * FROM transaction_room WHERE transaction_id=? AND room_id=?',
    getHotel_Info: 'SELECT DISTINCT e.name, e.address, e.city, e.state, e.hotel_id FROM transaction b, transaction_room c, room d, hotel e WHERE b.transaction_id = ? and b.transaction_id = c.transaction_id and c.room_id = d.room_id and d.hotel_id = e.hotel_id',

    //When query is ran -> returns an array that cannot be cancelled, else returns an empty array which means can be cancelled
    isCancellable: function ({ transaction_id }) {
      let query = `SELECT * FROM spartanhotel.transaction WHERE
                    transaction_id = ? AND date_in < CURDATE() AND status != 'cancelled';`

      return mysql.format(query, [transaction_id])
    },

    //When ran -> returns an array that cannot be MODIFIED, else returns an empty array 
    //meaning the booking can be modified
    isModifiable: function ({ booking_id }) {
      let query = `SELECT * FROM spartanhotel.transaction WHERE
                    booking_id = ? 
                    AND date_in <= CURDATE() 
                    AND date_out >= CURDATE() 
                    AND status != 'cancelled'
                    AND status != 'modified';`

      return mysql.format(query, [transaction_id])
    },

    // When ran -> returns an array with the selected result(s), else array is empty and isBookable is
    // ran for modifyAvailabilityCheck in reservation.js
    isOldBookingIdAndRoomId: function ({ transaction_id, room_id }) {
      let query = `SELECT * FROM spartanhotel.transaction WHERE
                    booking_id = ? 
                    AND room_id = ?  
                    AND status = 'booked';`

      return mysql.format(query, [transaction_id, room_id])
    },


    /**
     * 
     * @param {*} user_id 
     * @param {*} date_in 
     * @param {*} date_out 
     * @returns A query, which when run -> returns an array of bookings which conflict with the given inputs, else returns empty array
     */
    duplicateBookingCheck: function ({ user_id, date_in, date_out }) {
      let query = `
        SELECT 
          B.*,
          R.hotel_id,
          R.room_number,
          R.price,
          R.bed_type
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
   * {date_in, date_out, rooms:[room_ids]}
   * @returns {[]} 
   * 
   * This returns a query, that when run, will:
   * 
   * Return an array containing the room ids from rooms that are already booked
   * eg
   * 
   * params: {date_in: '2019-03-10', date_out: '2019-03-12', rooms:[1,2,3]}
   * 
   * rooms 1 and 2 are already booked
   * 
   * then
   * returns [1,2]
   * 
   * Else, returns an error message
   * 
    */
    isAlreadyBooked: function (params = {}) {

      let roomsBookedQuery = `
      SELECT 
        distinct(B.room_id)
      FROM
          spartanhotel.booking B
      WHERE
          date_in < ?
              AND date_out > ?
              AND status != 'cancelled'
              AND `
        ;
      let roomIdCondition = ""
      let placeholderValues = []
      let roomIdConditionQueryComponent = []
      placeholderValues.push(params.date_out)
      placeholderValues.push(params.date_in)


      for (i = 0; i < params.rooms.length; i++) {
        roomIdConditionQueryComponent.push("B.room_id = ?")
        placeholderValues.push(params.rooms[i])
      }
      roomIdCondition = roomIdConditionQueryComponent.join(" or ")

      roomsBookedQuery = roomsBookedQuery + "(" + roomIdCondition + ")"

      // console.log(roomsBookedQuery)


      let sql = mysql.format(roomsBookedQuery, placeholderValues)
      console.log(sql)

      return sql


    },

    /**
      * 
      * @param {*} params 
      * {date_in, date_out, rooms:[room_ids]}
      * @returns [{}] An array of {room_id, hotel_id, room_number, price, bed_type, capacity, booked}
      * booked = 0 means not booked
      * 
      * This returns a query, that when run, will:
      * 
      * Return an array containing the booked status and pricing info of each requested room
      * eg
      * 
      * params: {date_in: '2019-03-10', date_out: '2019-03-12', rooms:[1,2,3]}
      * 
      * rooms 1 and 2 are already booked
      * 
      * then
      * returns [{room_id:1, hotel_id, room_number, price, bed_type, capacity, 1},
      * {room_id:2, hotel_id, room_number, price, bed_type, capacity, 1},
      * {room_id:3, hotel_id, room_number, price, bed_type, capacity, 0}]
      * 
      * Else, returns an error message
      * 
       */
    bookableAndPriceCheck: function (params = {}) {

      // let q = `
      // SELECT 
      // A.*, (case when B_room_id IS NULL then FALSE else TRUE end)  as booked
      // FROM
      //     (SELECT 
      //         *
      //     FROM
      //         room R
      //     WHERE
      //         (R.room_id = 9 OR R.room_id = 11
      //             OR R.room_id = 8)) AS A
      // LEFT JOIN
      //     (SELECT DISTINCT
      //         (room_id) AS B_room_id
      //     FROM
      //         spartanhotel.booking B
      //     WHERE
      //         date_in < '2019-03-21'
      //             AND date_out > '2019-03-02'
      //             AND status != 'cancelled'
      //             AND (room_id = 9 OR room_id = 11
      //             OR room_id = 8)) 
      // AS AB ON A.room_id = B_room_id                                                              
      // `

      let q1 = `
      SELECT 
      A.*, (case when B_room_id IS NULL then FALSE else TRUE end)  as booked
      FROM
          (SELECT 
              *
          FROM
              room R
          WHERE
              
      `
      // (R.room_id = 9 OR R.room_id = 11
      //   OR R.room_id = 8))
      let placeholderComponentForRooms = []
      let placeholderValues = []
      let rooms = []
      for (i = 0; i < params.rooms.length; i++) {
        placeholderComponentForRooms.push("room_id = ?")
        rooms.push(params.rooms[i])
      }
      console.log(`AAA ${rooms}`)
      let roomIdCondition = "(" + placeholderComponentForRooms.join(" or ") + ")"

      q1 = q1 + " " + roomIdCondition + ")"
      placeholderValues.push.apply(placeholderValues, rooms)
      console.log(placeholderValues)


      let q2 = `
      AS A
      LEFT JOIN
          (SELECT DISTINCT
              (room_id) AS B_room_id
          FROM
              spartanhotel.booking B
          WHERE
              date_in < ?
                  AND date_out > ?
                  AND status != 'cancelled'
                  AND 
      `
      // (room_id = 9 OR room_id = 11
      //   OR room_id = 8))

      placeholderValues.push(params.date_out)
      placeholderValues.push(params.date_in)

      q2 = q2 + " " + roomIdCondition + ")"
      placeholderValues.push.apply(placeholderValues, rooms)


      let q3 = `
      AS AB ON A.room_id = B_room_id                                                              
      `

      let q = q1 + q2 + q3

      console.log(q)


      let sql = mysql.format(q, placeholderValues)
      console.log(sql)
      return sql
    },

    /**
    * The same as BookableAndPriceCheck, ignoring the given transaction_id
    * @param {*} params 
    * {date_in, date_out, rooms:[room_ids], transaction_id}
    * @returns [{}] An array of {room_id, hotel_id, room_number, price, bed_type, capacity, booked}
    * booked = 0 means not booked
    * 
    * This returns a query, that when run, will:
    * 
    * Return an array containing the booked status and pricing info of each requested room
    * eg
    * 
    * params: {date_in: '2019-03-10', date_out: '2019-03-12', rooms:[1,2,3], transaction_id: 1}
    * 
    * transaction #1 has
    * rooms 1 and 2 are booked during this time
    * 
    * the query ignores those because we might replace those rooms
    * 
    * then
    * returns [{room_id:1, hotel_id, room_number, price, bed_type, capacity, 0},
    * {room_id:2, hotel_id, room_number, price, bed_type, capacity, 0},
    * {room_id:3, hotel_id, room_number, price, bed_type, capacity, 0}]
    * 
    * Else, returns an error message
    * 
     */
    modify_BookableAndPriceCheck: function (params = {}) {

      // let q = `
      // SELECT 
      // A.*, (case when B_room_id IS NULL then FALSE else TRUE end)  as booked
      // FROM
      //     (SELECT 
      //         *
      //     FROM
      //         room R
      //     WHERE
      //         (R.room_id = 9 OR R.room_id = 11
      //             OR R.room_id = 8)) AS A
      // LEFT JOIN
      //     (SELECT DISTINCT
      //         (room_id) AS B_room_id
      //     FROM
      //         spartanhotel.booking B
      //     WHERE
      //         date_in < '2019-03-21'
      //             AND date_out > '2019-03-02'
      //             AND status != 'cancelled'
      //             AND (room_id = 9 OR room_id = 11
      //             OR room_id = 8)
      //            and transaction_id != 43
      //      ) 
      // AS AB ON A.room_id = B_room_id                                                              
      // `

      let q1 = `
    SELECT 
    A.*, (case when B_room_id IS NULL then FALSE else TRUE end)  as booked
    FROM
        (SELECT 
            *
        FROM
            room R
        WHERE
            
    `
      // (R.room_id = 9 OR R.room_id = 11
      //   OR R.room_id = 8))
      let placeholderComponentForRooms = []
      let placeholderValues = []
      let rooms = []
      for (i = 0; i < params.rooms.length; i++) {
        placeholderComponentForRooms.push("room_id = ?")
        rooms.push(params.rooms[i])
      }
      // console.log(`AAA ${rooms}`)
      let roomIdCondition = "(" + placeholderComponentForRooms.join(" or ") + ")"

      q1 = q1 + " " + roomIdCondition + ")"
      placeholderValues.push.apply(placeholderValues, rooms)
      // console.log(placeholderValues)


      let q2 = `
    AS A
    LEFT JOIN
        (SELECT DISTINCT
            (room_id) AS B_room_id
        FROM
            spartanhotel.booking B
        WHERE
            date_in < ?
                AND date_out > ?
                AND status != 'cancelled'
                AND 
    `
      // (room_id = 9 OR room_id = 11
      //   OR room_id = 8)


      placeholderValues.push(params.date_out)
      placeholderValues.push(params.date_in)

      q2 = q2 + " " + roomIdCondition
      placeholderValues.push.apply(placeholderValues, rooms)

      // and transaction_id != 43)
      let q3 = ` and transaction_id != ?) `
      placeholderValues.push(params.transaction_id)

      let q4 = `
    AS AB ON A.room_id = B_room_id                                                              
    `

      let q = q1 + q2 + q3 + q4

      console.log(q)


      let sql = mysql.format(q, placeholderValues)
      console.log(sql)
      return sql
    },






    /**
   * 
   * @param {*} params 
   * {date_in, date_out, rooms:[room_ids]}
   * @returns {*} 
   * 
   * This returns a query, that when run, will:
   * 
   * Return an array containing an object
   * eg
   * [{"available":1,"room_id":9,"hotel_id":5,"room_number":210,"price":138.46,"bed_type":"King"}]
   * available is false if = 0
   * 
   * Else, returns an error message
   * 
    */
    isBookable: function (params = {}) {
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

    },
  },

    rewards: {
      book: 'INSERT INTO spartanhotel.rewards(reward_book_id, user_id, room_id, reward_points, no_cancellation, date_in, date_out, status) values (null, ?, ?, ?, ?, ?, ?, ?)',
      book: 'INSERT INTO spartanhotel.rewards (reward_book_id, user_id, room_id, reward_points, no_cancellation, date_in, date_out, status) values (null, ?, ?, ?, ?, ?, ?, ?)',
      useOnBooking: 'INSERT INTO spartanhotel.reward (reward_id, user_id, reward_reason_id, transaction_id, date_active, `change`) values (null, ?, 1, ?, curdate(), ?)',
      gainFromBooking: 'INSERT INTO spartanhotel.reward (reward_id, user_id, reward_reason_id, transaction_id, date_active, `change`) values (null, ?, 2, ?, ?, ?)',
      getUserRecords: 'SELECT R.*,RR.reason FROM spartanhotel.reward R join spartanhotel.reward_reason RR on R.reward_reason_id = RR.reward_reason_id WHERE user_id=?',
      cancelBooking: 'DELETE from spartanhotel.reward where transaction_id=?',
      getOldBookingAppliedRewards: 'SELECT R.change FROM spartanhotel.reward R WHERE transaction_id = ? AND SIGN(R.change) = -1',
      getAppliedRewards: 'SELECT R.change FROM spartanhotel.reward R WHERE transaction_id = ? AND user_id = ? AND SIGN(R.change) = -1',
      getCurrentRewardsHistory: 'SELECT a.reward_id, a.transaction_id, a.date_active, a.change, b.reason FROM reward a, reward_reason b where a.reward_reason_id = b.reward_reason_id and user_id = ? and date_active <= curdate()',
      getFutureRewardsHistory: 'SELECT a.reward_id, a.transaction_id, a.date_active, a.change, b.reason FROM reward a, reward_reason b where a.reward_reason_id = b.reward_reason_id and user_id = ? and date_active >= curdate()',    
      getRewardsHistory: 'SELECT DISTINCT a.transaction_id, a.date_active, a.change, b.date_in, b.date_out, e.name FROM reward a, transaction b, transaction_room c, room d, hotel e WHERE a.transaction_id = b.transaction_id and a.user_id = ? and a.transaction_id = c.transaction_id and c.room_id = d.room_id and d.hotel_id = e.hotel_id'
    },

  guest: {
    insert: 'INSERT INTO spartanhotel.guest(guest_id, email, name) values (null, ?, ?)'
  },
  modify: {
    removeTransactionRoomDataAndRewardsForTransaction: `
      DELETE TR,R FROM transaction_room TR
        LEFT JOIN
        reward R
      ON TR.transaction_id = R.transaction_id
      WHERE
      TR.transaction_id = ?
      `,
    updateTransaction: 'UPDATE spartanhotel.transaction SET total_price=?, cancellation_charge=?, date_in=?, date_out=?, status=?, amount_paid=?, stripe_id=? WHERE transaction_id=?',
    getExistingTransaction: `
      SELECT B.transaction_id, group_concat(B.transaction_room_id) as transaction_room_ids, B.user_id, B.guest_id, B.total_price , B.cancellation_charge, ANY_VALUE(B.date_in) as date_in, ANY_VALUE(B.date_out) as date_out, B.status, B.amount_paid, B.stripe_id, B.room_price,
      R.bed_type, group_concat( distinct(url) ) as images, count(R.room_id) as quantity, group_concat(R.room_id) as room_ids FROM spartanhotel.booking B
	    join room R
      on R.room_id = B.room_id
      left join room_image
      on room_image.hotel_id = R.hotel_id and room_image.bed_type = R.bed_type
      WHERE transaction_id=?
      
      group by
              R.bed_type, B.room_price
      `,
  },
  email:{
      getHotelInfo: (hotelID)=>{
        let q1 = 'select * from spartanhotel.hotel where hotel_id = ?'
        let query = mysql.format(q1, hotelID)
        return query
      }
    },

  /**
  * 
  * @param {*} params 
  * {transactionid}
  * @returns {[{roomInfo1}, {roomInfo2} ...]} 
  * To get room info from transaction ID
  * 
 */
  transaction: {
    getRoomInfo: `SELECT ANY_VALUE(T.transaction_id) as transaction_id, ANY_VALUE(T.user_id) as user_id, ANY_VALUE(T.total_price) as total_price, ANY_VALUE(T.cancellation_charge) as cancellation_charge, ANY_VALUE(T.date_in) as date_in, ANY_VALUE(T.date_out) as date_out, 
                  ANY_VALUE(T.amount_paid) as amount_paid, ANY_VALUE(T.stripe_id) as stripe_id, 
                  ANY_VALUE(TR.room_price) as room_price, ANY_VALUE(R.hotel_id) as hotel_id, group_concat(R.room_number), R.bed_type, ANY_VALUE(R.capacity) as capacity, ANY_VALUE(RI.url) as image,
                  COUNT(T.transaction_id) as quantity
                  FROM spartanhotel.transaction T
                  join spartanhotel.transaction_room TR
                  on T.transaction_id = TR.transaction_id
                  join spartanhotel.room R
                  on TR.room_id = R.room_id
                  join spartanhotel.room_image RI
                  on RI.bed_type = R.bed_type AND RI.hotel_id = R.hotel_id
                  where T.transaction_id = ?
                  group by R.bed_type, R.price;`
  }
}
