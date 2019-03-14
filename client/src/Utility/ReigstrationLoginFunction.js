import axios from 'axios'

export const registerPost = temp_fields => {
    return axios.post('/api/register', {
        firstname: temp_fields.firstname,
        lastname: temp_fields.lastname,
        email: temp_fields.email,
        password: temp_fields.password,
    }).then(response => {
        console.log("Registered")
        localStorage.setItem('accesstoken', response.data)
        return response.data
    }).catch(error => {
        console.log(error)
    })
}