import { combineReducers } from 'redux'
import {
  SET_DRAWER_LOCKMODE, SET_NAV_INDEX, FETCH_SCHEDULE_SUCCESS,
  SET_PAGE_LOADING, FETCH_SCHEDULE_LOCAL, ADD_TODO
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
  data: []
}

function schedulePage(state = defaultSchedule, action) {
  switch (action.type) {
    case SET_PAGE_LOADING:
      if (action.page == 'schedulePage') {
        return Object.assign({}, state, {
          loading: action.loading
        })
      }
      break
    
    case FETCH_SCHEDULE_SUCCESS:
      const data = action.payload.todolist.map(todo => {
        return todo.id
      })
      return {
        loading: false,
        data: data
      }
    
    case FETCH_SCHEDULE_LOCAL:
      return {
        loading: false,
        data: action.payload.data
      }

    case ADD_TODO:
      const d = state.data.slice()
      d.push(action.payload.id)
      return Object.assign({}, state, {
        data: d
      })
  }

  return state
}

const view = combineReducers({
  navigationViewSelectedIndex,
  drawerLockMode,
  schedulePage
})

export default view
