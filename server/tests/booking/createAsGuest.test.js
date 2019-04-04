/**
 * @jest-environment node
 */

const axios = require("axios");
const qs = require("querystring");

const baseURL = "http://localhost:3001/api";

const makeReservation = baseURL + "/reservations";
const cancelReservation = baseURL + "/reservations/cancellation";

describe("reservations - as guest", () => {
    test("make reservation w/ invalid submitted data", () => {
        expect.assertions(1);
        return axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 88.0,
                cancellation_charge: 8.8,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                status: "booked"
            })
            .then(
                response => {
                    throw "response should be 400"
                },
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                }
            );
    });
    test("make and remove 1-day reservation w/ valid data", async () => {
        expect.assertions(2);
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                status: "booked"
            })
            .then(
                response => {
                    // console.log(response.data);
                    expect(response.status).toEqual(200);
                    return response.data
                },
                err => {
                    throw "failed to create booking"
                }
            );
            // console.log(result)
        let booking_id = result.data
        await axios
            .post(cancelReservation, {
                booking_id: booking_id
            })
            .then(
                response => {
                    // console.log(response.data);
                    expect(response.status).toEqual(200);
                },
                err => {
                    throw "failed to delete booking"
                }
            );
    });
    
});
