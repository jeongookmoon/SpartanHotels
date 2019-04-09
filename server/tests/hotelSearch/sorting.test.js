/**
 * @jest-environment node
 */

const axios = require('axios')
const qs = require("querystring")

const baseURL = "http://localhost:3001/api"

const hotelSearch = baseURL + "/search/hotels"

describe('hotel search',()=>{
    describe('sortBy',()=>{
        // default sortBy is A-Z
        test('default sortBy', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12"}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(11)
                expect(response.data.results.length).toEqual(10)
                let hotel_names = response.data.results.map(ele=>ele.name)
                let isAtoZ = hotel_names.every((currentValue, currentIndex, arr) => {
                    return currentIndex
                      ? currentValue.localeCompare(arr[currentIndex - 1]) >= 0
                      : true;
                  });
                expect(isAtoZ).toBe(true)
                },
                err=>{
                }
            )
        })
        test('sortBy price_asc', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", sortBy:"price_asc"}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(11)
                expect(response.data.results.length).toEqual(10)
                let hotel_min_prices = response.data.results.map(ele=>ele.min_price)
                // console.log(hotel_min_prices)
                let isPriceAsc = hotel_min_prices.every((currentValue, currentIndex, arr) => {
                    return currentIndex
                      ? currentValue >= (arr[currentIndex - 1])
                      : true;
                  });
                expect(isPriceAsc).toBe(true)
                },
                err=>{
                }
            )
        })
        test('sortBy price_des', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", sortBy:"price_des"}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(11)
                expect(response.data.results.length).toEqual(10)
                let hotel_min_prices = response.data.results.map(ele=>ele.min_price)
                // console.log(hotel_min_prices)
                let isPriceDes = hotel_min_prices.every((currentValue, currentIndex, arr) => {
                    return currentIndex
                      ? currentValue <= (arr[currentIndex - 1])
                      : true;
                  });
                expect(isPriceDes).toBe(true)
                },
                err=>{
                }
            )
        })
        test('sortBy name_asc', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", sortBy:"name_asc"}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(11)
                expect(response.data.results.length).toEqual(10)
                let hotel_names = response.data.results.map(ele=>ele.name)
                let isAtoZ = hotel_names.every((currentValue, currentIndex, arr) => {
                    return currentIndex
                      ? currentValue.localeCompare(arr[currentIndex - 1]) >= 0
                      : true;
                  });
                expect(isAtoZ).toBe(true)
                },
                err=>{
                }
            )
        })
        test('sortBy name_des', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", sortBy:"name_des"}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(11)
                expect(response.data.results.length).toEqual(10)
                let hotel_names = response.data.results.map(ele=>ele.name)
                let isZtoA = hotel_names.every((currentValue, currentIndex, arr) => {
                    return currentIndex
                      ? currentValue.localeCompare(arr[currentIndex - 1]) <= 0
                      : true;
                  });
                expect(isZtoA).toBe(true)
                },
                err=>{
                }
            )
        })
        test('sortBy rating_asc', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", sortBy:"rating_asc"}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(11)
                expect(response.data.results.length).toEqual(10)
                let hotel_ratings = response.data.results.map(ele=>ele.rating)
                // console.log(hotel_ratings)
                let isRatingAsc = hotel_ratings.every((currentValue, currentIndex, arr) => {
                    return currentIndex
                      ? currentValue >= (arr[currentIndex - 1])
                      : true;
                  });
                expect(isRatingAsc).toBe(true)
                },
                err=>{
                }
            )
        })
        test('sortBy rating_des', ()=>{
            return axios.get(hotelSearch, 
                {params:{date_in:"2019-03-10", date_out:"2019-03-12", sortBy:"rating_des"}})
            .then( response=>{
                expect(response.status).toEqual(200)
                expect(response.data.totalResultCount).toEqual(11)
                expect(response.data.results.length).toEqual(10)
                let hotel_ratings = response.data.results.map(ele=>ele.rating)
                // console.log(hotel_ratings)
                let isRatingDes = hotel_ratings.every((currentValue, currentIndex, arr) => {
                    return currentIndex
                      ? currentValue <= (arr[currentIndex - 1])
                      : true;
                  });
                expect(isRatingDes).toBe(true)
                },
                err=>{
                }
            )
        })

    })
})