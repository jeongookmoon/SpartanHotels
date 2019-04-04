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

describe("reservations - as user", () => {
    test("make reservation w/ invalid submitted data", () => {
        expect.assertions(1);
        return axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 88.0,
                cancellation_charge: 8.8,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                status: "booked",
            },
            {
                withCredentials:true,
                headers: {
                    cookie: loginResponse.headers["set-cookie"] // need this bc not this is browser-less; normally browser would send the cookie received from login
                  }   
            })
            .then(
                response => {
                    throw "response should be 400"
                },
                error => {
                    // let err = error.response.data
                    // console.log(error.response)
                    expect(error.response.status).toEqual(400);
                    // expect(err).toEqual(expect.stringContaining("date_in missing"))
                }
            );
    });
    test("make and cancel 1-day reservation w/ valid data", async () => {
        expect.assertions(2);
        
            
        let result = await axios
            .post(makeReservation, {
                room_id: 7,
                total_price: 225.5,
                cancellation_charge: 41,
                date_in: "2019-03-20",
                date_out: "2019-03-21",
                status: "booked",},{
                withCredentials:true,
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
            console.log(result)
        let booking_id = result.data
        await axios
            .post(
                cancelReservation,
                {
                    booking_id: booking_id
                },
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
                    expect(response.status).toEqual(200);
                },
                err => {
                    throw `failed to delete booking ${err}`
                }
            );
    });
    
});
