import { combineReducers } from 'redux'
import { SET_DRAWER_LOCKMODE, SET_NAV_INDEX, FETCH_SCHEDULE_SUCCESS } from '../constants/actionTypes'

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

const defaultSchedule = {
  loading: false,
  data: []
}

function schedulePage(state = defaultSchedule, action) {
  switch (action.type) {
    case FETCH_SCHEDULE_SUCCESS:
      return {
        loading: false,
        data: action.payload.todolist
      }
  }

  return state
}

const view = combineReducers({
  navigationViewSelectedIndex,
  drawerLockMode,
  schedulePage
})

export default view
