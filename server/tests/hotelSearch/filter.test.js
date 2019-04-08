/**
 * @jest-environment node
 */

const axios = require('axios')
const qs = require("querystring")

const baseURL = "http://localhost:3001/api"

const hotelSearch = baseURL + "/search/hotels"

// Might want to add test for when an amenity is part of the word of another amenity
// Ex: 'smoking' is part of the word 'non-smoking'

describe('hotel search',()=>{
    describe('filter',()=>{
        test('amenities wifi', ()=>{
            let amenities = ["wifi"]
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", amenities: JSON.stringify(encodeURIComponent(amenities))}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(11)
                },
                err=>{
                }
            )
        })
        test('amenities sound proof', ()=>{
            let amenities = ["sound proof"]
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", amenities: JSON.stringify(encodeURIComponent(amenities))}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(2)
                },
                err=>{
                }
            )
        })
        test('amenities bathtub', ()=>{
            let amenities = ["bathtub"]
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", amenities: JSON.stringify(encodeURIComponent(amenities))}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(5)
                },
                err=>{
                }
            )
        })
        test('amenities pool & balcony', ()=>{
            let amenities = ["pool","balcony"]
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", amenities: JSON.stringify(encodeURIComponent(amenities))}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(2)
                },
                err=>{
                }
            )
        })
        test('amenities pool & bbq', ()=>{
            let amenities = ["pool","barbeque"]
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", amenities: JSON.stringify(encodeURIComponent(amenities))}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(0)
                },
                err=>{
                }
            )
        })

        test('price filter >= 100', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceGTE:100}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(6)
                },
                err=>{
                }
            )
        })
        test('price filter <= 100', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceLTE:100}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(7)
                },
                err=>{
                }
            )
        })
        test('price filter >= 79.01', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceGTE:79.01}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(7)
                },
                err=>{
                }
            )
        })
        test('price filter <= 79.01', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceLTE:79.01}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(4)
                },
                err=>{
                }
            )
        })
        test('price filter <= 0', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceLTE:0}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(0)
                },
                err=>{
                }
            )
        })
        test('price filter >= 0', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceGTE:0}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(11)
                },
                err=>{
                }
            )
        })
        test('price filter <= -1', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceLTE:-1}})
            .then( response=>{
                throw "response should be 400"
                },
                err=>{
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('price filter >= 1000', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceGTE:1000}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(0)
                },
                err=>{
                }
            )
        })
        test('price filter GTE NaN', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceGTE:"a"}})
            .then( response=>{
                throw "response should be 400"
                },
                err=>{
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('price filter LTE NaN', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceLTE:"a"}})
            .then( response=>{
                throw "response should be 400"
                },
                err=>{
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('price filter  70<=X<=120', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceLTE:120, priceGTE:70}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(5)
                },
                err=>{
                }
            )
        })
        test('price filter  70<=X<=70', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceLTE:70, priceGTE:70}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(0)
                },
                err=>{
                }
            )
        })
        test('price filter  69<=X<=69', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceLTE:69, priceGTE:69}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(1)
                },
                err=>{
                }
            )
        })
        test('price filter  69<=X && X>=120', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", priceLTE:69, priceGTE:120}})
            .then( response=>{
                throw "response should be 400"
                },
                err=>{
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('rating filter negative stars', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", rating: -10}})
            .then( response=>{
                throw "response should be 400"
                },
                err=>{
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('rating filter NaN stars', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", rating: "a"}})
            .then( response=>{
                throw "response should be 400"
                },
                err=>{
                    expect(err.response.status).toEqual(400)
                }
            )
        })
        test('rating filter 0 stars', ()=>{
            throw "cant test bc no 0 star hotels; should there even be?"
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", rating: 0}})
            .then( 
                response=>{
                    expect(response.status).toEqual(200)
                    expect(response.data.totalResultCount).toEqual(10)
                },
                err=>{
                }
            )
        })
        test('rating filter 3 stars', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", rating: 3}})
            .then( 
                response=>{
                    expect(response.status).toEqual(200)
                    expect(response.data.totalResultCount).toEqual(5)
                },
                err=>{
                }
            )
        })
        test('rating filter 5 stars', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", rating: 5}})
            .then( 
                response=>{
                    expect(response.status).toEqual(200)
                    expect(response.data.totalResultCount).toEqual(1)
                },
                err=>{
                }
            )
        })
        test('rating filter >5 stars', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", rating: 6}})
            .then( 
                response=>{
                    throw "response should be 400"
                },
                err=>{
                    expect(err.response.status).toEqual(400)
                }
            )
        })

    })
})