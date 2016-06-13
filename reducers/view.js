import { combineReducers } from 'redux'
import {
  SET_DRAWER_LOCKMODE, SET_NAV_INDEX, FETCH_SCHEDULE_SUCCESS,
  SET_PAGE_LOADING, FETCH_SCHEDULE_LOCAL, ADD_TODO, SHOW_DIALOG,
  CLOSE_DIALOG, SET_STATUS_FUILTER, SET_TYPE_FILTER
} from '../constants/actionTypes'

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
  data: [],
  statusFilter: '',
  typeFilter: ''
}

function schedulePage(state = defaultSchedule, action) {
  switch (action.type) {
    case SET_PAGE_LOADING:
      if (action.page === 'schedulePage') {
        return Object.assign({}, state, {
          loading: action.loading
        })
      }
      break
    
    case FETCH_SCHEDULE_SUCCESS:
      const data = action.payload.todolist.map(todo => {
        return todo.id
      })
      return Object.assign({}, state, {
        data: data
      }) 
    
    case FETCH_SCHEDULE_LOCAL:
      return Object.assign({}, state, action.payload.schedulePage)

    case ADD_TODO:
      const d = state.data.slice()
      d.push(action.payload.id)
      return Object.assign({}, state, {
        data: d
      })

    case SET_STATUS_FUILTER:
      if (action.page === 'schedulePage') {
        return Object.assign({}, state, {
          statusFilter: action.payload
        })
      }
      break

    case SET_TYPE_FILTER:
      if (action.page === 'schedulePage') {
        return Object.assign({}, state, {
          typeFilter: action.payload
        })
      }
      break
  }

  return state
}

function dialog(state = {}, action) {
  switch (action.type) {
    case SHOW_DIALOG:
      return Object.assign({
        visible: true
      }, action.payload)
    case CLOSE_DIALOG:
      return {
        visible: false
      }
  }

  return state
}

const view = combineReducers({
  navigationViewSelectedIndex,
  drawerLockMode,
  schedulePage,
  dialog
})

export default view
