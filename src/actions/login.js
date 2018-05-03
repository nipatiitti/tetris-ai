import axios from 'axios'

import {loading, error, baseUrl} from './utils.js'

export const login = (email, password) => {
  return (dispatch) => {
    
    dispatch(loading(true))
    axios.post(baseUrl + '/login', {
      email,
      password
    })
      .then(({data}) => {
        dispatch(loading(false))
        dispatch(saveToken(data.token))
      })
      .catch((errorinfo) => {
        dispatch(loading(false))
        dispatch(error(errorinfo.response.data))
      })
  }
}

