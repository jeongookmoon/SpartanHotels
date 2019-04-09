/**
 * @jest-environment node
 */

const axios = require('axios')
const qs = require("querystring")

const baseURL = "http://localhost:3001/api"

function urlForRoomsAtHotel(hotelId){
    return baseURL + "/search/hotels/" + hotelId 
}




describe('room search',()=>{

    describe('date checking',()=>{
        test('date mm/dd/yyyy format', ()=>{
            return axios.get( urlForRoomsAtHotel(2), {params:{date_in:"03/08/2019", date_out:"03/10/2019"}})
            .then( response=>{
                // console.log(response.data)
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(2)
            })
        })
        test('same date_in as date_out', ()=>{
            return axios.get(urlForRoomsAtHotel(2), 
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
            return axios.get(urlForRoomsAtHotel(2), 
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
            return axios.get(urlForRoomsAtHotel(2), 
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
            return axios.get(urlForRoomsAtHotel(2), 
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
        return axios.get(urlForRoomsAtHotel(2))
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
        return axios.get(urlForRoomsAtHotel(2), {params:{date_in:"2019-03-08"}})
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
        return axios.get(urlForRoomsAtHotel(2), {params:{date_in:"2019-03-08", date_out:"2019-03-10"}})
        .then( response=>{
            // console.log(response.data)
            expect(response.status).toEqual(200)
        })
    })
    test('default # of results returned', ()=>{
        return axios.get(urlForRoomsAtHotel(2), {params:{date_in:"2019-03-08", date_out:"2019-03-10"}})
        .then( response=>{
            // console.log(response.data)
            throw "cant test default # of results returned until there are more than 10 rooms at one hotel to return"
            expect(response.status).toEqual(200)
            expect(response.data.totalResultCount).toEqual(10)
        })
    })
    test('(none) bookable at hotel 5', ()=>{
        return axios.get(urlForRoomsAtHotel(5), {params:{date_in:"2019-03-16", date_out:"2019-03-21"}})
        .then( response=>{
            // console.log(response.data)
            expect(response.status).toEqual(200)
            let room_ids = response.data.results.map(ele=>ele.room_id)
                // console.log(room_ids)
            expect(room_ids).toEqual(expect.arrayContaining([]))
            expect(response.data.totalResultCount).toEqual(0)
        })
    })
    test('(rm 10) bookable at hotel 5', ()=>{
        return axios.get(urlForRoomsAtHotel(5), {params:{date_in:"2019-03-08", date_out:"2019-03-11"}})
        .then( response=>{
            // console.log(response.data)
            expect(response.status).toEqual(200)
            let room_ids = response.data.results.map(ele=>ele.room_id)
                // console.log(room_ids)
            expect(room_ids).toEqual(expect.arrayContaining([10]))
            expect(response.data.totalResultCount).toEqual(1)
        })
    })
    test('(rm 9,10) bookable at hotel 5', ()=>{
        return axios.get(urlForRoomsAtHotel(5), {params:{date_in:"2019-03-12", date_out:"2019-03-14"}})
        .then( response=>{
            // console.log(response.data)
            expect(response.status).toEqual(200)
            let room_ids = response.data.results.map(ele=>ele.room_id)
                // console.log(room_ids)
            expect(room_ids).toEqual(expect.arrayContaining([9,10]))
            expect(response.data.totalResultCount).toEqual(2)
        })
    })
    test('(rm 9) bookable at hotel 5', ()=>{
        return axios.get(urlForRoomsAtHotel(5), {params:{date_in:"2019-03-27", date_out:"2019-03-28"}})
        .then( response=>{
            // console.log(response.data)
            expect(response.status).toEqual(200)
            let room_ids = response.data.results.map(ele=>ele.room_id)
                // console.log(room_ids)
            expect(room_ids).toEqual(expect.arrayContaining([9]))
            expect(response.data.totalResultCount).toEqual(1)
        })
    })
    test('(rm 3,4) bookable at hotel 2', ()=>{
        return axios.get(urlForRoomsAtHotel(2), {params:{date_in:"2019-03-03", date_out:"2019-03-05"}})
        .then( response=>{
            // console.log(response.data)
            expect(response.status).toEqual(200)
            let room_ids = response.data.results.map(ele=>ele.room_id)
                // console.log(room_ids)
            expect(room_ids).toEqual(expect.arrayContaining([3,4]))
            expect(response.data.totalResultCount).toEqual(2)
        })
    })
    test('(rm 12) bookable at hotel 6', ()=>{
        return axios.get(urlForRoomsAtHotel(6), {params:{date_in:"2019-03-01", date_out:"2019-03-03"}})
        .then( response=>{
            // console.log(response.data)
            expect(response.status).toEqual(200)
            let room_ids = response.data.results.map(ele=>ele.room_id)
                // console.log(room_ids)
            expect(room_ids).toEqual(expect.arrayContaining([12]))
            expect(response.data.totalResultCount).toEqual(1)
        })
    })
    test('(rm 11,12) bookable at hotel 6', ()=>{
        return axios.get(urlForRoomsAtHotel(6), {params:{date_in:"2019-03-18", date_out:"2019-03-20"}})
        .then( response=>{
            // console.log(response.data)
            expect(response.status).toEqual(200)
            let room_ids = response.data.results.map(ele=>ele.room_id)
                // console.log(room_ids)
            expect(room_ids).toEqual(expect.arrayContaining([11,12]))
            expect(response.data.totalResultCount).toEqual(2)
        })
    })



})

