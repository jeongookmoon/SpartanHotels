import axios from 'axios'

export const sendcodePost = email_value => {
    return axios.post('/api/recovery',{
        email: email_value
    }).then(response => {
        if(response.stastu === 200) {
            localStorage.setItem('accesstoken', response.data)
        }
        return response.status
    }).catch(error => {
        return error.response.status
    })
}


export const checkCodePost = temp_fields => {
    return axios.post('/api/checkcode', {
        access_code: temp_fields.access_code,
        email: temp_fields.email
    }).then(response => {
        if(response.status === 200) {
            localStorage.setItem('accesstoken', response.data)
        }
        return response.status
    }).catch(error => {
        //console.log(error.response.status)
        return error.response.status
    })
}