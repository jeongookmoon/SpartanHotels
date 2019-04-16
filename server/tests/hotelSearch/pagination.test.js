/**
 * @jest-environment node
 */

const axios = require('axios')
const qs = require("querystring")

const baseURL = "http://localhost:3001/api"

const hotelSearch = baseURL + "/search/hotels"

describe('hotel search',()=>{
    describe('pagination',()=>{
        test('pageNumber is NaN', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", pageNumber:"abc"}})
            .then( response=>{
                throw "should not have valid response"
                },
                err=>{
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('pageNumber is < 0', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", pageNumber:-1}})
            .then( response=>{
                throw "should not have valid response"
                },
                err=>{
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('pageNumber is 0', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", pageNumber:0}})
            .then( response=>{
                
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(11)
                },
                err=>{
                }
            )
        })
        test('resultsPerPage is NaN', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", resultsPerPage:"a"}})
            .then( 
                response=>{
                    throw "response should be error"
                },
                err=>{
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('resultsPerPage is < 0', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", resultsPerPage:-10}})
            .then( 
                response=>{
                    throw "response should be error"
                },
                err=>{
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('resultsPerPage is 0', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", resultsPerPage:0}})
            .then( 
                response=>{
                    throw "response should be error"
                },
                err=>{
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('11 results, 3 resultsPerPage, page 0', ()=>{
            expect.assertions(3);
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", resultsPerPage:3, pageNumber:0}})
            .then( 
                response=>{
                    expect(response.status).toEqual(200)
                    expect(response.data.results.length).toEqual(3)
                    expect(response.data.totalResultCount).toEqual(11)
                },
                err=>{
                }
            )
        })
        test('11 results, 3 resultsPerPage, page 3', ()=>{
            expect.assertions(3);
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", resultsPerPage:3, pageNumber:3}})
            .then( 
                response=>{
                    // console.log(response)
                    expect(response.status).toEqual(200)
                    expect(response.data.results.length).toEqual(2)
                    expect(response.data.totalResultCount).toEqual(11)
                },
                err=>{
                }
            )
        })
        test('11 results, 3 resultsPerPage, page 4', ()=>{
            expect.assertions(3);
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", resultsPerPage:3, pageNumber:4}})
            .then( 
                response=>{
                    // console.log(response)
                    expect(response.status).toEqual(200)
                    expect(response.data.results.length).toEqual(0)
                    expect(response.data.totalResultCount).toEqual(11)
                },
                err=>{
                }
            )
        })
        test('10 results, 2 resultsPerPage, page 1', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-14", date_out:"2019-03-21", resultsPerPage:2}})
            .then( 
                response=>{
                    expect(response.status).toEqual(200)
                    expect(response.data.totalResultCount).toEqual(10)
                    expect(response.data.results.length).toEqual(2)
                    let hotel_ids = response.data.results.map(ele=>ele.hotel_id)
                    // console.log(hotel_ids)
                    expect(hotel_ids).toEqual(expect.not.arrayContaining([5]))
                },
                err=>{
                }
            )
        })
        test('10 results, 2 resultsPerPage, page 100', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-14", date_out:"2019-03-21", resultsPerPage:2, pageNumber:100}})
            .then( 
                response=>{
                    expect(response.status).toEqual(200)
                    expect(response.data.totalResultCount).toEqual(10)
                    expect(response.data.results.length).toEqual(0)
                },
                err=>{
                }
            )
        })
        test('10 results, 200 resultsPerPage, page 0', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-14", date_out:"2019-03-21", resultsPerPage:200, pageNumber:0}})
            .then( 
                response=>{
                    expect(response.status).toEqual(200)
                    expect(response.data.totalResultCount).toEqual(10)
                    expect(response.data.results.length).toEqual(10)
                },
                err=>{
                }
            )
        })
        test('10 results, 200 resultsPerPage, page 1', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-14", date_out:"2019-03-21", resultsPerPage:200, pageNumber:1}})
            .then( 
                response=>{
                    expect(response.status).toEqual(200)
                    expect(response.data.totalResultCount).toEqual(10)
                    expect(response.data.results.length).toEqual(0)
                },
                err=>{
                }
            )
        })
        test('default resultsPerPage & default pageNumber when >10 total results', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-02-14", date_out:"2019-02-21"}})
            .then( 
                response=>{
                    // may also need to change date
                    expect(response.status).toEqual(200)
                    expect(response.data.totalResultCount).toBeGreaterThan(10)
                    expect(response.data.results.length).toEqual(10)
                },
                err=>{
                }
            )
        })
        test('default resultsPerPage & default pageNumber when 11 total results', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12"}})
            .then( 
                response=>{
                    expect(response.status).toEqual(200)
                    expect(response.data.totalResultCount).toEqual(11)
                    expect(response.data.results.length).toEqual(10)
                },
                err=>{
                }
            )
        })
        test('default resultsPerPage & default pageNumber when 10 total results', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-14", date_out:"2019-03-21"}})
            .then( 
                response=>{
                    expect(response.status).toEqual(200)
                    expect(response.data.totalResultCount).toEqual(10)
                    expect(response.data.results.length).toEqual(10)
                },
                err=>{
                }
            )
        })
    })
})