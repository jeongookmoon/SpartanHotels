/**
 * @jest-environment node
 */

const axios = require("axios");
const qs = require("querystring");

const baseURL = "http://localhost:3001/api";

const makeReservation = baseURL + "/reservations";
const cancelReservation = baseURL + "/reservations/cancellation";

let bookingId;

describe("reservations - multiple booking", () => {
    beforeEach(() => {
        return axios
            .post(makeReservation, {
                user_id: 9,
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
                    bookingId = response.data.data
                },
                err => {
                    throw "create booking failed"
                }
            );
    });

    afterEach(() => {
        return axios
            .post(cancelReservation, {
                booking_id: bookingId
            })
            .then(
                response => {
                    // console.log(response.data);
                },
                err => {
                    throw "failed to delete booking"
                }
            );
    })


    test("attempt reservation multiple booking identical", () => {
        expect.assertions(1);
        return axios
            .post(makeReservation, {
                user_id: 9,
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                status: "booked"
            })
            .then(
                response => {
                    throw "multiple booking succeeded"
                },
                err => {
                    // console.log(err.response.data);
                    expect(err.response.status).toEqual(400);
                }
            );
    });
    test("attempt reservation multiple booking (diff room, same date)", () => {
        expect.assertions(1);
        return axios
            .post(makeReservation, {
                user_id: 9,
                room_id: 2,
                total_price: 71.5,
                cancellation_charge: 13,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                status: "booked"
            })
            .then(
                response => {
                    throw "multiple booking succeeded"
                },
                err => {
                    // console.log(err.response.data);
                    expect(err.response.status).toEqual(400);
                }
            );
    });
    test("attempt reservation multiple booking (same room, overlapping date)", () => {
        expect.assertions(1);
        return axios
            .post(makeReservation, {
                user_id: 9,
                room_id: 7,
                total_price: 225.5 * 3,
                cancellation_charge: 41,
                date_in: "2019-03-18",
                date_out: "2019-03-21",
                status: "booked"
            })
            .then(
                response => {
                    throw "multiple booking succeeded"
                },
                err => {
                    // console.log(err.response.data);
                    expect(err.response.status).toEqual(400);
                }
            );
    });
    test("attempt reservation multiple booking (diff room, overlapping date)", () => {
        expect.assertions(1);
        return axios
            .post(makeReservation, {
                user_id: 9,
                room_id: 2,
                total_price: 71.5 * 3,
                cancellation_charge: 13,
                date_in: "2019-03-18",
                date_out: "2019-03-21",
                status: "booked"
            })
            .then(
                response => {
                    throw "multiple booking succeeded"
                },
                err => {
                    // console.log(err.response.data);
                    expect(err.response.status).toEqual(400);
                }
            );
    });
});
