import axios from 'axios'

export const HotelSearchFunction = temp_fields => {
    // console.log(temp_fields)
    return axios.get('/api/search/hotels', {
        params: temp_fields

    }).then(response => {
        if (response.status === 200) {
        }
        return response.data
    })
}
