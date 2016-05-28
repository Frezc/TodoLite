import { fetchR } from '../helpers'
import { AUTH_URL } from '../constants/urls'
import { AUTH_FAILED, AUTH_SUCCESS } from '../constants/actionTypes'

export function auth(email, password) {
  return dispatch => {
    const data = new FormData()
    data.append('email', email)
    data.append('password', password)

    return fetchR(AUTH_URL, {
      method: 'POST',
      body: data
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          dispatch(authSuccess(json))
        })
      } else {
        response.json().then(json => {
          dispatch(authFailed(json.error))
        })
      }

    }).catch(error => {
      dispatch(authFailed('Fetch failed'))
    })
  }
}

export function authSuccess(json) {
  return {
    type: AUTH_SUCCESS,
    payload: json
  }
}

export function authFailed(error) {
  return {
    type: AUTH_FAILED,
    payload: error
  }
}
