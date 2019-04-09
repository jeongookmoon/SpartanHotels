/**
 * @jest-environment node
 */

const axios = require("axios");
const qs = require("querystring");

const baseURL = "http://localhost:3001/api";

const makeReservation = baseURL + "/reservations";
const cancelReservation = baseURL + "/reservations/cancellation";

describe("reservations - as guest", () => {
    test("make reservation w/ incorrect price data", () => {
        expect.assertions(1);
        return axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 88.0,
                cancellation_charge: 8.8,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_email: 'test@test.com',
                guest_name: 'Test Tester',
                amount_paid: 200.5
            })
            .then(
                response => {
                    return axios
                        .post(cancelReservation, {
                            booking_id: booking_id
                        })
                        .then(
                            response => {
                                throw "make reservation should have failed"
                            },
                            err => {
                                throw "failed to delete booking"
                            }
                        );
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
                guest_email: 'test@test.com',
                guest_name: 'Test Tester',
                amount_paid: 225.5
            })
            .then(
                response => {
                    // console.log(response.data);
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
    test("missing email", async () => {
        expect.assertions(1);
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_name: 'Test Tester',
                amount_paid: 225.5
            })
            .then(
                response => {
                    let booking_id = response.data
                    return axios
                        .post(cancelReservation, {
                            booking_id: booking_id
                        })
                        .then(
                            response => {
                                throw "make reservation should have failed"
                            },
                            err => {
                                throw "failed to delete booking"
                            }
                        );
                    throw "response should be 400"
                },
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                }
            );
            // console.log(result)
        
    });
    test("invalid email", async () => {
        expect.assertions(1);
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_name: 'Test Tester',
                guest_email: 'haha hoho',
                amount_paid: 225.5
            })
            .then(
                response => {
                    let booking_id = response.data
                    return axios
                        .post(cancelReservation, {
                            booking_id: booking_id
                        })
                        .then(
                            response => {
                                throw "make reservation should have failed"
                            },
                            err => {
                                throw "failed to delete booking"
                            }
                        );
                    
                },
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                }
            );
            // console.log(result)
        
    });
    test("missing name", async () => {
        expect.assertions(1);
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_email: 'haha hoho',
                amount_paid: 225.5
            })
            .then(
                response => {
                    let booking_id = response.data
                    return axios
                        .post(cancelReservation, {
                            booking_id: booking_id
                        })
                        .then(
                            response => {
                                throw "make reservation should have failed"
                            },
                            err => {
                                throw "failed to delete booking"
                            }
                        );
                    throw "response should be 400"
                },
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                }
            );
            // console.log(result)
        
    });
    test("amount paid negative", async () => {
        expect.assertions(1);
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_name: 'Test Tester',
                guest_email: 'haha hoho',
                amount_paid: -20
            })
            .then(
                response => {
                    let booking_id = response.data
                    return axios
                        .post(cancelReservation, {
                            booking_id: booking_id
                        })
                        .then(
                            response => {
                                throw "make reservation should have failed"
                            },
                            err => {
                                throw "failed to delete booking"
                            }
                        );
                    throw "response should be 400"
                },
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                }
            );
            // console.log(result)
        
    });
    test("amount paid NaN", async () => {
        expect.assertions(1);
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_name: 'Test Tester',
                guest_email: 'haha hoho',
                amount_paid: "dgaf"
            })
            .then(
                response => {
                    let booking_id = response.data
                    return axios
                        .post(cancelReservation, {
                            booking_id: booking_id
                        })
                        .then(
                            response => {
                                throw "make reservation should have failed"
                            },
                            err => {
                                throw "failed to delete booking"
                            }
                        );
                    throw "response should be 400"
                },
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                }
            );
            // console.log(result)
        
    });
    test("20 reward pts applied as guest", async () => {
        expect.assertions(1);
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_name: 'Test Tester',
                guest_email: 'haha hoho',
                amount_paid: 205.5,
                rewards_applied: 20
            })
            .then(
                response => {
                    let booking_id = response.data
                    return axios
                        .post(cancelReservation, {
                            booking_id: booking_id
                        })
                        .then(
                            response => {
                                throw "make reservation should have failed"
                            },
                            err => {
                                throw "failed to delete booking"
                            }
                        );
                    throw "response should be 400"
                },
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                }
            );
            // console.log(result)
        
    });
    test("total price < amount paid", async () => {
        expect.assertions(1);
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_name: 'Test Tester',
                guest_email: 'haha hoho',
                amount_paid: 255.5
            })
            .then(
                response => {
                    let booking_id = response.data
                    return axios
                        .post(cancelReservation, {
                            booking_id: booking_id
                        })
                        .then(
                            response => {
                                throw "make reservation should have failed"
                            },
                            err => {
                                throw "failed to delete booking"
                            }
                        );
                    throw "response should be 400"
                },
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                }
            );
            // console.log(result)
        
    });
    test("total price > amount paid", async () => {
        expect.assertions(1);
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_name: 'Test Tester',
                guest_email: 'haha hoho',
                amount_paid: 125.5
            })
            .then(
                response => {
                    let booking_id = response.data
                    return axios
                        .post(cancelReservation, {
                            booking_id: booking_id
                        })
                        .then(
                            response => {
                                throw "make reservation should have failed"
                            },
                            err => {
                                throw "failed to delete booking"
                            }
                        );
                    throw "response should be 400"
                },
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                }
            );
            // console.log(result)
        
    });
    test("guest email already in guest table, diff name", async () => {
        expect.assertions(2);
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_email: 'guest@example.com',
                guest_name: 'Test Tester',
                amount_paid: 225.5
            })
            .then(
                response => {
                    // console.log(response.data);
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
    test("guest email already in guest table, same name", async () => {
        expect.assertions(2);
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_email: 'guest@example.com',
                guest_name: 'Guest A',
                amount_paid: 225.5
            })
            .then(
                response => {
                    // console.log(response.data);
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
    test("guest name is empty string", async () => {
        expect.assertions(2);
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                guest_email: 'guest@example.com',
                guest_name: '',
                amount_paid: 225.5
            })
            .then(
                response => {
                    // console.log(response.data);
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
