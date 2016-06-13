import React from 'react';
import {
  Text,
  ProgressBarAndroid,
  AsyncStorage
} from 'react-native'
import {
  SET_NAV_INDEX, SET_DRAWER_LOCKMODE, SET_PAGE_LOADING, 
  UPDATE_TODO, ADD_TODO, SHOW_DIALOG, CLOSE_DIALOG,
  SET_STATUS_FUILTER, SET_TYPE_FILTER, AUTH_SUCCESS
} from '../constants/actionTypes'
import { fetchSchedule } from './network'
import { saveSchedule, saveTodos, saveScheduleAndTodos } from './data'
import { Colors } from '../assets/Theme'


/**
 * 在app开始时进行的action
 */
export function appStart() {
  return dispatch => {
    return AsyncStorage.getItem('auth')
      .then(result => {
        if (result) {
          const auth = JSON.parse(result)
          // dispatch(refreshToken(auth.token))
          dispatch({
            type: AUTH_SUCCESS,
            payload: auth
          })

          dispatch(fetchSchedule(auth.token))
        }
      })
  }
}

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
    return saveTodos(getState())
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
    return saveScheduleAndTodos(getState())
  }
}

export function addLocalTodo(todo) {
  return {
    type: ADD_TODO,
    payload: todo
  }
}

export function showDialog(config) {
  return {
    type: SHOW_DIALOG,
    payload: config
  }
}

export function showLoadingDialog(title, onRequestClose) {
  return {
    type: SHOW_DIALOG,
    payload: {
      title,
      onRequestClose,
      content: (
        <ProgressBarAndroid
          color={Colors.accent100}
        />
      )
    }
  }
}

export function showConfirmDialog(title, description, cb) {
  return {
    type: SHOW_DIALOG,
    payload: {
      title,
      content: (
        <Text>
          {description}
        </Text>
      ),
      onRequestClose: () => {
        cb && cb('CLOSE')
      },
      actions: [{
        text: 'CANCEL',
        onPress: () => {
          cb && cb('CANCEL')
        }
      }, {
        text: 'OK',
        onPress: () => {
          cb && cb('OK')
        }
      }]
    }
  }
}

export function closeDialog() {
  return {
    type: CLOSE_DIALOG
  }
}

export function setStatusFilter(page, status) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_STATUS_FUILTER,
      page,
      payload: status
    })
    return saveSchedule(getState())
  }
}

export function setTypeFilter(page, type) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_TYPE_FILTER,
      page,
      payload: type
    })
    return saveSchedule(getState())
  }
}
