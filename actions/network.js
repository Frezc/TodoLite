import {
  AsyncStorage,
  ToastAndroid
} from 'react-native'
import { fetchR, constructQuery, resolveErrorResponse } from '../helpers'
import { REFRESH_URL, TODOLIST_URL, UNAUTH_URL, TODO_URL } from '../constants/urls'
import { APPIDENTITY } from '../constants'
import { AUTH_FAILED, AUTH_SUCCESS, FETCH_SCHEDULE_SUCCESS, LOGOUT } from '../constants/actionTypes'
import { setPageLoading } from './view'

/**
 * 身份验证成功
 * @param json
 */
export function authSuccess(json) {

  return dispatch => {
    return AsyncStorage.setItem('auth', JSON.stringify(json))
      .then(err => {
        console.log('err ' + err)
        console.log('json ' + JSON.stringify(json));
        dispatch({
          type: AUTH_SUCCESS,
          payload: json
        })
      })
  }
}

export function authFailed(error) {
  return {
    type: AUTH_FAILED,
    payload: error
  }
}

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

/**
 * 因为token是不会过期的 所以暂时不使用刷新
 * @param token 旧token
 */
export function refreshToken(token) {
  return dispatch => {
    return fetchR(`${REFRESH_URL}?app=${APPIDENTITY}&token=${token}`)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            ToastAndroid.show('refresh success: ' + JSON.stringify(json), ToastAndroid.SHORT)
            dispatch(authSuccess(json))
          })
        } else {
          ToastAndroid.show('Auto auth failed. Please re-auth.', ToastAndroid.SHORT)
        }
      }).catch(error => {
        ToastAndroid.show(error, ToastAndroid.SHORT)
      })
  }
}

function fetchTodoList(token, params = {}) {
  let query = constructQuery(params)
  if (query) query = '&' + query
  console.log('fetch todolist', `${TODOLIST_URL}?token=${token}${query}`);
  return fetchR(`${TODOLIST_URL}?token=${token}${query}`)
}

/**
 * 从api获取schedule
 * @param token
 */
export function fetchScheduleNetwork(token) {
  return dispatch => {
    dispatch(setPageLoading('schedulePage'))
    fetchTodoList(token, {
      status: 'todo'
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          json.todolist.map(todo => {
            todo.contents = JSON.parse(todo.contents)
          })
          dispatch(fetchScheduleSuccess(json))
        })
      } else {
        resolveErrorResponse(response)
      }
    }).catch(err => {
      ToastAndroid.show(err, ToastAndroid.SHORT)
    })
  }
}

/**
 * 尝试获得本地的schedule, 如果没有则调用上面的action
 * @param token
 * @returns {function()}
 */
export function fetchSchedule(token) {
  return dispatch => {
    return AsyncStorage.getItem('schedule')
      .then(result => {
        if (result) {
          dispatch({
            type: FETCH_SCHEDULE_SUCCESS,
            payload: JSON.parse(result)
          })
        } else {
          dispatch(fetchScheduleNetwork(token))
        }
      })
  }
}

/**
 * 成功从api获取schedule的数据，并保存到本地
 * @param json
 */
function fetchScheduleSuccess(json) {
  return dispatch => {
    return AsyncStorage.setItem('schedule', JSON.stringify(json))
      .then(err => {
        console.log('err ' + err)
        console.log('json ' + JSON.stringify(json));
        dispatch({
          type: FETCH_SCHEDULE_SUCCESS,
          payload: json
        })
      })
  }
}

/**
 * 退出登录
 */
export function logout(token) {
  return dispatch => {
    return fetchR(`${UNAUTH_URL}?app=${APPIDENTITY}&token=${token}`)
      .then(response => {
        dispatch({
          type: LOGOUT
        })
        return AsyncStorage.removeItem('auth')
          .then(err => {
            ToastAndroid.show('logout: ' + err, ToastAndroid.SHORT)
          })
      }).catch(err => {
        ToastAndroid.show(err, ToastAndroid.SHORT)
      })
  }
}
