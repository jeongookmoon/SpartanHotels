import axios from 'axios'

export const logoutClearSession = () => {
  return axios.get('/api/logout')
    .then(res => {
      // console.log(res)
    })
}
export const changePass = (temp_fields) => {
  return axios.post('/api/UserProfileChangePass', {
    oldpass: temp_fields.oldpass,
    newpass: temp_fields.newpass,
  }).then(response => {
    if (response.status === 200) {
    }
    return response.status
  }).catch(error => {
    //console.log(error.response.status)
    return error.response.status
  })
}

export const changeName = (temp_fields) => {
  return axios.post('/api/changeName', {
    name: temp_fields.name
  }).then(response => {
    if (response.status === 200) {
    }
    return response.status
  }).catch(error => {
    //console.log(error.response.status)
    return error.response.status
  })
}

export const registerPost = temp_fields => {
  return axios.post('/api/register', {
    firstname: temp_fields.firstname,
    lastname: temp_fields.lastname,
    email: temp_fields.email,
    password: temp_fields.password,
  }).then(response => {
    if (response.status === 200) {
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

export const verifyLogin = () => {
  return axios.get('/api/verifyuser')
    .then(response => {
      if (response.data === "S") {
        localStorage.setItem('accesstoken', response.data)
      } else {
        localStorage.removeItem('accesstoken')
      }
    })
    .catch(error => console.log("error", error))
}
