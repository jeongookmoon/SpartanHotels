/**
 * @jest-environment node
 */

/**
 * NOTE: Guests ARE able to have multiple bookings!
 */

const axios = require("axios");
const qs = require("querystring");

const baseURL = "http://localhost:3001/api";

const makeReservation = baseURL + "/reservations";
const cancelReservation = baseURL + "/reservations/cancellation";

let bookingId;

describe("reservations - guest multiple booking", () => {
    beforeEach(() => {
        return axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_email: 'test@test.com',
                guest_name: 'Test Tester',
                amount_paid: 225.5
            })
            .then(
                response => {
                    // console.log(response.data);
                    bookingId = response.data.data
                },
                err => {
                    throw `create booking failed ${err.response.data}`
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
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_email: 'test@test.com',
                guest_name: 'Test Tester',
                amount_paid: 225.5
            })
            .then(
                response => {
                    let booking_id = response.data.data
                    axios
                        .post(cancelReservation, {
                            booking_id: booking_id
                        })
                        .then(
                            response => {
                                throw "multiple/duplicate booking succeeded"
                            },
                            err => {
                                throw "failed to delete booking"
                            }
                        );  
                    
                },
                err => {
                    // console.log(err.response.data);
                    expect(err.response.status).toEqual(400);
                }
            );
    });
    test("attempt reservation multiple booking (diff room, same date)", () => {
        expect.assertions(2);
        return axios
            .post(makeReservation, {
                room_id: 2,
                total_price: 71.5,
                cancellation_charge: 13,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_email: 'test@test.com',
                guest_name: 'Test Tester',
                amount_paid: 71.5
            })
            .then(
                response => {
                    expect(response.status).toEqual(200)
                    let booking_id = response.data.data
                    axios
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
                },
                err => {
                    // console.log(err.response.data);
                    throw "multiple booking failed; GUESTS SHOULD BE ABLE TO MULTIPLE BOOK"
                }
            );
    });
    test("attempt reservation multiple booking (same room, overlapping date)", () => {
        expect.assertions(1);
        return axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5 * 3,
                cancellation_charge: 41,
                date_in: "2019-03-18",
                date_out: "2019-03-21",
                guest_email: 'test@test.com',
                guest_name: 'Test Tester',
                amount_paid: 225.5 * 3
            })
            .then(
                response => {
                    throw "multiple booking succeeded/ overlapping date for same room"
                },
                err => {
                    // console.log(err.response.data);
                    expect(err.response.status).toEqual(400);
                }
            );
    });
    test("attempt reservation multiple booking (diff room, overlapping date)", () => {
        expect.assertions(2);
        return axios
            .post(makeReservation, {
                room_id: 2,
                total_price: 71.5 * 3,
                cancellation_charge: 13 * 3,
                date_in: "2019-03-18",
                date_out: "2019-03-21",
                guest_email: 'test@test.com',
                guest_name: 'Test Tester',
                amount_paid: 71.5 * 3
            })
            .then(
                response => {
                    expect(response.status).toEqual(200)
                    let booking_id = response.data.data
                    axios
                        .post(cancelReservation, {
                            booking_id: booking_id
                        })
                        .then(
                            response => {
                                // console.log(response.data);
                                expect(response.status).toEqual(200);
                            },
                            err => {
                                throw `failed to delete booking ${err.response.data}`
                            }
                        );
                },
                err => {
                    console.log(err.response.data);
                    throw "multiple booking failed; GUESTS SHOULD BE ABLE TO MULTIPLE BOOK"
                }
            );
    });
});
