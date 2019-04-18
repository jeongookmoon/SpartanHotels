import axios from 'axios'

export const logoutClearSession = () => {
    return axios.get('/api/logout')
        .then(res => {
            // console.log(res)
        })
}

export const registerPost = temp_fields => {
    return axios.post('/api/register', {
        firstname: temp_fields.firstname,
        lastname: temp_fields.lastname,
        email: temp_fields.email,
        password: temp_fields.password,
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

export const loginPost = temp_fields => {
    return axios.post('/api/login', {
        email: temp_fields.email,
        password: temp_fields.password,
    }).then(response => {
        // console.log("login result status: " + response.data)
        // log-in possible only when server says "S"
        if (response.data === "S") {
            localStorage.setItem('accesstoken', response.data)
        } 
        return response.data
    }).catch(error => {
        // console.log("error message for login: " + error)
    })





}