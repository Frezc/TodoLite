import { SET_NAV_INDEX, SET_DRAWER_LOCKMODE, SET_PAGE_LOADING, UPDATE_TODO, ADD_TODO } from '../constants/actionTypes'
import { saveSchedule } from './data'

export function setNavIndex(index) {
  return {
    type: SET_NAV_INDEX,
    payload: index
  }
}

export function setDrawerLockMode(mode) {
  return {
    type: SET_DRAWER_LOCKMODE,
    payload: mode
  }
}

/**
 * @param page page can be one of ['schedulePage']
 * @param isLoading is loading now
 */
export function setPageLoading(page, isLoading = true) {
  return {
    type: SET_PAGE_LOADING,
    page: page,
    loading: isLoading
  }
}

export function refreshTodo(todo) {
  return (dispatch, getState) => {
    todo.contents = JSON.parse(todo.contents)
    dispatch(updateLocalTodo(todo))
    return saveSchedule(getState())
      .then(err => {

      })
  }
}

export function updateLocalTodo(todo) {
  return {
    type: UPDATE_TODO,
    payload: todo
  }
}

export function addTodo(todo) {
  return (dispatch, getState) => {
    todo.contents = JSON.parse(todo.contents)
    dispatch(addLocalTodo(todo))
    return saveSchedule(getState())
  }
}

export function addLocalTodo(todo) {
  return {
    type: ADD_TODO,
    payload: todo
  }
}
