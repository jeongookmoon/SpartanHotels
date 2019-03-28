/**
 * @jest-environment node
 */

const axios = require('axios')
const qs = require("querystring")

const baseURL = "http://localhost:3001/api"

const makeReservation = baseURL + "/reservations"

describe('reservations',()=>{
    test("make reservation", () => {
        return axios
          .post(makeReservation, {
            user_id: 9,
            room_id: 7,
            total_price: 88.00,
            cancellation_charge: 8.8,
            date_in: "2019-03-20",
            date_out: "2019-03-21",
            status: "booked"
          })
          .then(response => {
            console.log(response.data)
            expect(response.status).toEqual(200);
            
          });
      });

})