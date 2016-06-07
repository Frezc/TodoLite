import { combineReducers } from 'redux'
import { AUTH_SUCCESS, LOGOUT } from '../constants/actionTypes'

const defaultUser = {
  id: -1,
  nickname: 'not login'
}

function user(state = null, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return action.payload.user
    case LOGOUT:
      return null
  }
  return state
}

function token(state = null, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return action.payload.token
    case LOGOUT:
      return null
  }
  return state
}

const auth = combineReducers({
  user,
  token
})

export default auth
