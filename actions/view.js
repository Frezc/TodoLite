import React from 'react';
import {
  Text,
  TextInput,
  AsyncStorage,
  ActivityIndicator
} from 'react-native'
import {
  SET_NAV_INDEX, SET_DRAWER_LOCKMODE, SET_PAGE_LOADING, 
  UPDATE_TODO, ADD_TODO, SHOW_DIALOG, CLOSE_DIALOG,
  SET_STATUS_FUILTER, SET_TYPE_FILTER, AUTH_SUCCESS,
  SET_SEARCH_TEXT, SET_YEAR, PAGE_READY
} from '../constants/actionTypes'
import { fetchSchedule,fetchHistoryLocal } from './network'
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

          // 不在这里进行耗时工作
          // 加速首屏渲染
          // dispatch(fetchSchedule(auth.token))
          // history 页面不会再app开始时就从网络请求
          // 只有当转到history页面, 并且本地没数据时才会进行请求
          // dispatch(fetchHistoryLocal())
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
  return (dispatch) => {
    todo.contents = JSON.parse(todo.contents)
    dispatch(updateLocalTodo(todo))
    return dispatch(saveTodos())
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
  return (dispatch) => {
    todo.contents = JSON.parse(todo.contents)
    dispatch(addLocalTodo(todo))
    return dispatch(saveScheduleAndTodos())
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
        <ActivityIndicator
          color={Colors.accent100}
          size="large"
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
  return {
    type: SET_STATUS_FUILTER,
    page,
    payload: status
  }
}

export function setTypeFilter(page, type) {
  return {
    type: SET_TYPE_FILTER,
    page,
    payload: type
  }
}

export function setSearchText(page, text) {
  return {
    type: SET_SEARCH_TEXT,
    page,
    payload: text
  }
}

export function pageReady(page) {
  return {
    type: PAGE_READY,
    payload: page
  }
}

export function setYear(year) {
  return {
    type: SET_YEAR,
    payload: year
  }
}
