/**
 * @jest-environment node
 */

const axios = require("axios");
axios.defaults.withCredentials = true;
const qs = require("querystring");

const baseURL = "http://localhost:3001/api";

const login = baseURL + "/login";
const logout = baseURL + "/logout";
const makeReservation = baseURL + "/reservations";
const cancelReservation = baseURL + "/reservations/cancellation";

let loginResponse // stores logged in user's cookie
let bookingId;


beforeAll( async ()=>{
    loginResponse =  await axios
        .post(login, {
            email: "tom12345@gmail.com",
            password: "1234",
        },{withCredentials: true})
    // console.log(loginResponse)
})

afterAll( () => {
    return axios
        .get(logout,
            { withCredentials:true,
            headers: {
                cookie: loginResponse.headers["set-cookie"] // need this bc not this env is browser-less; normally browser would send the cookie received from login
              }})
})

describe("reservations - user multiple booking", () => {
    beforeEach(() => {
        return axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                amount_paid: 225.5},
                {
                    withCredentials:true,
                    headers: {
                        cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                      }
                }
            )
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
            },
            {
                withCredentials:true,
                headers: {
                    cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                  }
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
                amount_paid: 225.5
            },
            {
                withCredentials:true,
                headers: {
                    cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                  }
            })
            .then(
                response => {
                    let booking_id = response.data.data
                    return axios
                        .post(
                            cancelReservation,
                            {
                                booking_id: booking_id
                            },
                            {
                                withCredentials: true,
                                headers: {
                                    cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                                }
                            }
                        ).then(
                            (res) => { throw "make reservation should have failed" },
                            (err) => { throw "failed to delete booking" }
                        )
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
                room_id: 2,
                total_price: 71.5,
                cancellation_charge: 13,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                amount_paid: 71.5,
            },
            {
                withCredentials:true,
                headers: {
                    cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                  }
            })
            .then(
                response => {
                    let booking_id = response.data.data
                    return axios
                        .post(
                            cancelReservation,
                            {
                                booking_id: booking_id
                            },
                            {
                                withCredentials: true,
                                headers: {
                                    cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                                }
                            }
                        ).then(
                            (res) => { throw "make reservation should have failed" },
                            (err) => { throw "failed to delete booking" }
                        )
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
                room_id: 7,
                total_price: 225.5 * 3,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                date_in: "2019-03-18",
                date_out: "2019-03-21",
                amount_paid: 225.5 * 3
            },
            {
                withCredentials:true,
                headers: {
                    cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                  }
            })
            .then(
                response => {
                    let booking_id = response.data.data
                    return axios
                        .post(
                            cancelReservation,
                            {
                                booking_id: booking_id
                            },
                            {
                                withCredentials: true,
                                headers: {
                                    cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                                }
                            }
                        ).then(
                            (res) => { throw "make reservation should have failed" },
                            (err) => { throw "failed to delete booking" }
                        )
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
                room_id: 2,
                total_price: 71.5 * 3,
                cancellation_charge: 13,
                date_in: "2019-03-18",
                date_out: "2019-03-21",
                total_price: 71.5 * 3
            },
            {
                withCredentials:true,
                headers: {
                    cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                  }
            })
            .then(
                response => {
                    let booking_id = response.data.data
                    return axios
                        .post(
                            cancelReservation,
                            {
                                booking_id: booking_id
                            },
                            {
                                withCredentials: true,
                                headers: {
                                    cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                                }
                            }
                        ).then(
                            (res) => { throw "make reservation should have failed" },
                            (err) => { throw "failed to delete booking" }
                        )
                },
                err => {
                    // console.log(err.response.data);
                    expect(err.response.status).toEqual(400);
                }
            );
    });
});
