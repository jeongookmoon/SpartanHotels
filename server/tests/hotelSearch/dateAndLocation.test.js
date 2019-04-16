/**
 * @jest-environment node
 */

const axios = require('axios')
const qs = require("querystring")

const baseURL = "http://localhost:3001/api"

const hotelSearch = baseURL + "/search/hotels"

describe('hotel search',()=>{

    describe('date checking',()=>{
        test('date mm/dd/yyyy format', ()=>{
            return axios.get(hotelSearch, {params:{date_in:"03/08/2019", date_out:"03/10/2019"}})
            .then( response=>{
                // console.log(response.data)
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(11)
            })
        })
        test('same date_in as date_out', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-08", date_out:"2019-03-08"}})
            .then( response=>{
                throw "response should be 400 error"
                },
                err=>{
                    // console.log(err)
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('date_in after date_out', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-08"}})
            .then( response=>{
                throw "response should be 400 error"
                },
                err=>{
                    // console.log(err)
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('invalid date_in', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10a", date_out:"2019-03-12"}})
            .then( response=>{
                throw "response should be 400 error"
                },
                err=>{
                    // console.log(err)
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('invalid date_out', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12a"}})
            .then( response=>{
                throw "response should be 400 error"
                },
                err=>{
                    // console.log(err)
                    expect(err.response.status).toEqual(400)
                }
            )
        })
    })

    test('no querystring params', ()=>{
        expect.assertions(2)
        return axios.get(hotelSearch)
        .then( response=>{
            // console.log(response)
            },
            error =>{
                let err = error.response.data
                // console.log(error.response)
                expect(error.response.status).toEqual(400)
                expect(err).toEqual(expect.stringContaining("date_in missing"))
            }
        ) 
    })
    test('only date_in', ()=>{
        expect.assertions(2)
        return axios.get(hotelSearch, {params:{date_in:"2019-03-08"}})
        .then( response=>{
            console.log(response)
        },
        error =>{
            let err = error.response.data
            // console.log(error.response)
            expect(error.response.status).toEqual(400)
            expect(err).toEqual(expect.stringContaining("date_out missing"))
        })  
    })
    test('only date_in and date_out', ()=>{
        return axios.get(hotelSearch, {params:{date_in:"2019-03-08", date_out:"2019-03-10"}})
        .then( response=>{
            // console.log(response.data)
            expect(response.status).toEqual(200)
        })
    })
    test('default # of results returned', ()=>{
        return axios.get(hotelSearch, {params:{date_in:"2019-03-08", date_out:"2019-03-10"}})
        .then( response=>{
            // console.log(response.data)
            expect(response.status).toEqual(200)
            expect(response.data.totalResultCount).toEqual(11)
        })
    })

    describe('location searching',()=>{
        test('state=California', ()=>{
            return axios.get(hotelSearch, {params:{date_in:"2019-03-08", date_out:"2019-03-10", state:"California"}})
            .then( response=>{
                // console.log(response.data)
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(4)
            })
        })
        
        test('city=LA', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-08", date_out:"2019-03-10", city:"Los Angeles"}})
            .then( response=>{
                // console.log(response.data.results)
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(2)
                let hotel_ids = response.data.results.map(ele=>ele.hotel_id)
                // console.log(hotel_ids)
                expect(hotel_ids).toEqual(expect.arrayContaining([5,6]))
            })
        })
        test('zip=74301', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-08", date_out:"2019-03-10", zip:"74301"}})
            .then( response=>{
                // console.log(response.data.results)
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(1)
                let hotel_ids = response.data.results.map(ele=>ele.hotel_id)
                // console.log(hotel_ids)
                expect(hotel_ids).toEqual(expect.arrayContaining([1]))
            })
        })
        test('zip not in db', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-08", date_out:"2019-03-10", zip:"99999"}})
            .then( response=>{
                // console.log(response.data.results)
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(0)
            })
        })
        test('zip not a valid us zipcode', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-08", date_out:"2019-03-10", zip:"9999a"}})
            .then( response=>{
                throw "response should be 400 error"
                },
                err=>{
                    // console.log(err)
                    expect(err.response.status).toEqual(400)
                }
            )
        })
    })


})

