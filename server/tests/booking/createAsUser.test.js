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

beforeAll(async () => {
    loginResponse = await axios
        .post(login, {
            email: "tom12345@gmail.com",
            password: "1234",
        }, { withCredentials: true })
    // console.log(loginResponse)
})

afterAll(() => {
    return axios
        .get(logout,
            {
                withCredentials: true,
                headers: {
                    cookie: loginResponse.headers["set-cookie"] // need this bc not this env is browser-less; normally browser would send the cookie received from login
                }
            })
})

describe("reservations - as user", () => {
    test("make reservation w/ incorrect price data", () => {
        expect.assertions(1);
        return axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 88.0,
                cancellation_charge: 8.8,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                amount_paid: 88
            },
                {
                    withCredentials: true,
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
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                    // expect(err).toEqual(expect.stringContaining("date_in missing"))
                }
            );
    });
    test("make and cancel 1-day reservation w/ valid data w/o rewards", async () => {
        expect.assertions(2);


        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                amount_paid: 225.5
            }, {
                    withCredentials: true,
                    headers: {
                        cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                    }

                })

            .then(
                response => {
                    // console.log(response);
                    expect(response.status).toEqual(200);
                    return response.data
                },
                err => {
                    throw `failed to create booking ${err}`
                }
            );
        // console.log(result)
        let booking_id = result.data
        await axios
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
            )
            .then(
                response => {
                    // console.log(response.data);
                    expect(response.status).toEqual(200);
                },
                err => {
                    throw `failed to delete booking ${err}`
                }
            );
    });
    test("make and cancel 1-day reservation w/ valid data with rewards", async () => {
        expect.assertions(2);


        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                amount_paid: 205.5,
                rewards_applied: 20
            }, {
                    withCredentials: true,
                    headers: {
                        cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                    }

                })

            .then(
                response => {
                    // console.log(response);
                    expect(response.status).toEqual(200);
                    return response.data
                },
                err => {
                    throw `failed to create booking ${err.response.data}`
                }
            );
        // console.log(result)
        let booking_id = result.data
        await axios
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
            )
            .then(
                response => {
                    // console.log(response.data);
                    expect(response.status).toEqual(200);
                },
                err => {
                    throw `failed to delete booking ${err}`
                }
            );
    });
    test("redeem free reservation w/ rewards", async () => {
        expect.assertions(2);


        let result = await axios
            .post(makeReservation, {
                room_id: 5,
                total_price: 54.56,
                cancellation_charge: 9.92,
                date_in: "2019-03-28",
                date_out: "2019-03-29",
                amount_paid: 0,
                rewards_applied: 54.56
            }, {
                    withCredentials: true,
                    headers: {
                        cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                    }

                })

            .then(
                response => {
                    // console.log(response);
                    expect(response.status).toEqual(200);
                    return response.data
                },
                err => {
                    throw `failed to create booking ${err.response.data}`
                }
            );
        // console.log(result)
        let booking_id = result.data
        await axios
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
            )
            .then(
                response => {
                    // console.log(response.data);
                    expect(response.status).toEqual(200);
                },
                err => {
                    throw `failed to delete booking ${err}`
                }
            );
    });
    test("user submits negative rewards", () => {
        expect.assertions(1);
        return axios
            .post(makeReservation, {
                room_id: 5,
                total_price: 54.56,
                cancellation_charge: 9.92,
                date_in: "2019-03-28",
                date_out: "2019-03-29",
                amount_paid: 55.56,
                rewards_applied: -1
            },
                {
                    withCredentials: true,
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
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                    // expect(err).toEqual(expect.stringContaining("date_in missing"))
                }
            );
    });
    
    test("extra guest_email data", async () => {
        expect.assertions(2);


        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                amount_paid: 225.5,
                guest_email: "hello@gmail.com"
            }, {
                    withCredentials: true,
                    headers: {
                        cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                    }

                })

            .then(
                response => {
                    // console.log(response);
                    expect(response.status).toEqual(200);
                    return response.data
                },
                err => {
                    throw `failed to create booking ${err}`
                }
            );
        // console.log(result)
        let booking_id = result.data
        await axios
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
            )
            .then(
                response => {
                    // console.log(response.data);
                    expect(response.status).toEqual(200);
                },
                err => {
                    throw `failed to delete booking ${err}`
                }
            );
    });
    test("extra guest_email data as empty string", async () => {
        expect.assertions(2);


        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                amount_paid: 225.5,
                guest_email: ""
            }, {
                    withCredentials: true,
                    headers: {
                        cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                    }

                })

            .then(
                response => {
                    // console.log(response);
                    expect(response.status).toEqual(200);
                    return response.data
                },
                err => {
                    throw `failed to create booking ${err}`
                }
            );
        // console.log(result)
        let booking_id = result.data
        await axios
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
            )
            .then(
                response => {
                    // console.log(response.data);
                    expect(response.status).toEqual(200);
                },
                err => {
                    throw `failed to delete booking ${err}`
                }
            );
    });
    test("extra guest data fields", async () => {
        expect.assertions(2);


        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                amount_paid: 225.5,
                guest_email: "a@a.com",
                guest_name: "Sal B"
            }, {
                    withCredentials: true,
                    headers: {
                        cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                    }

                })

            .then(
                response => {
                    // console.log(response);
                    expect(response.status).toEqual(200);
                    return response.data
                },
                err => {
                    throw `failed to create booking ${err}`
                }
            );
        // console.log(result)
        let booking_id = result.data
        await axios
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
            )
            .then(
                response => {
                    // console.log(response.data);
                    expect(response.status).toEqual(200);
                },
                err => {
                    throw `failed to delete booking ${err}`
                }
            );
    });


    test("make reservation w/ incorrect price data", () => {
        expect.assertions(1);
        return axios
            .post(makeReservation, {
                room_id: 5,
                total_price: 54.56,
                cancellation_charge: 9.92,
                date_in: "2019-03-28",
                date_out: "2019-03-29",
                amount_paid: -5.44,
                rewards_applied: 60
            },
                {
                    withCredentials: true,
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
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                    // expect(err).toEqual(expect.stringContaining("date_in missing"))
                }
            );
    });


});
