import { combineReducers } from 'redux'
import { SET_DRAWER_LOCKMODE, SET_NAV_INDEX } from '../constants/actionTypes'

function navigationViewSelectedIndex(state = 0, action) {
  switch (action.type) {
    case SET_NAV_INDEX:
      return action.payload
  }
  
  return state
}

function drawerLockMode(state = 'unlocked', action) {
  switch (action.type) {
    case SET_DRAWER_LOCKMODE:
      return action.payload
  }
  return state
}

const view = combineReducers({
  navigationViewSelectedIndex,
  drawerLockMode
})

export default view
