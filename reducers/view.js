import { combineReducers } from 'redux'
import string from '../constants/string'
import { SET_APPBAR_TITLE, SET_NAV_INDEX } from '../constants/actionTypes'

function appBarTitle(state = 'Schedule', action) {
  switch (action.type) {
    case SET_APPBAR_TITLE:
      return action.payload
  }
  
  return state
}

function navigationViewSelectedIndex(state = 0, action) {
  switch (action.type) {
    case SET_NAV_INDEX:
      return action.payload
  }
  
  return state
}

const view = combineReducers({
  appBarTitle,
  navigationViewSelectedIndex
})

export default view
