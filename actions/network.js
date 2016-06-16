import {
  AsyncStorage,
  ToastAndroid
} from 'react-native'
import { fetchR, constructQuery, resolveErrorResponse } from '../helpers'
import { REFRESH_URL, TODOLIST_URL, UNAUTH_URL, HISTORY_URL } from '../constants/urls'
import { APPIDENTITY } from '../constants'
import {
  AUTH_FAILED, AUTH_SUCCESS, FETCH_SCHEDULE_SUCCESS, LOGOUT,
  FETCH_SCHEDULE_LOCAL, FETCH_HISTORY_SUCCESS, APPEND_HISTORY_SUCCESS
} from '../constants/actionTypes'
import { setPageLoading } from './view'
import { saveScheduleAndTodos, saveHistory } from './data'

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
      status: 'todo,layside'
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          json.todolist.map(todo => {
            todo.contents = JSON.parse(todo.contents)
          })
          dispatch(fetchScheduleSuccess(json))
          ToastAndroid.show('Refresh successfully.', ToastAndroid.SHORT)
        })
      } else {
        resolveErrorResponse(response)
      }
      dispatch(setPageLoading('schedulePage', false))
    }).catch(err => {
      ToastAndroid.show(err, ToastAndroid.SHORT)
      dispatch(setPageLoading('schedulePage', false))
    })
  }
}

/**
 * 尝试获得本地的schedule, 如果没有则调用上面的action
 * @param token
 */
export function fetchSchedule(token) {
  return dispatch => {
    return Promise.all([AsyncStorage.getItem('schedule'), AsyncStorage.getItem('todos')])
      .then(result => {
        if (result[0] && result[1]) {
          // ToastAndroid.show(result, ToastAndroid.LONG)
          const schedulePage = JSON.parse(result[0])
          schedulePage.loading = false
          dispatch({
            type: FETCH_SCHEDULE_LOCAL,
            payload: {
              schedulePage,
              todos: JSON.parse(result[1])
            }
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
  return (dispatch) => {
    dispatch({
      type: FETCH_SCHEDULE_SUCCESS,
      payload: json
    })

    return dispatch(saveScheduleAndTodos())
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
        return AsyncStorage.clear()
          .then(err => {
            ToastAndroid.show('logout: ' + err, ToastAndroid.SHORT)
          })
      }).catch(err => {
        ToastAndroid.show(err, ToastAndroid.SHORT)
      })
  }
}

export function fetchHistoryNetwork(token, year, params) {
  return dispatch => {
    const fetchParams = Object.assign({ offset: 0, limit: 50 }, params)
    const query = constructQuery(fetchParams)
    dispatch(setPageLoading('historyPage'))
    console.log('fetch', `${HISTORY_URL}?token=${token}&year=${year}&${query}`);
    return fetchR(`${HISTORY_URL}?token=${token}&year=${year}&${query}`)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            console.log('response', json);
            json.todolist.map(todo => {
              todo.contents = JSON.parse(todo.contents)
            })
            dispatch(fetchHistorySuccess(json, fetchParams.offset))
          })
        } else {
          resolveErrorResponse(response)
        }
        dispatch(setPageLoading('historyPage', false))
      }).catch(err => {
        ToastAndroid.show(err.message, ToastAndroid.SHORT)
        dispatch(setPageLoading('historyPage', false))
      })
  }
}

export function fetchHistorySuccess(json, offset) {
  return (dispatch) => {
    dispatch({
      type: FETCH_HISTORY_SUCCESS,
      offset,
      payload: json
    })

    return dispatch(saveHistory())
  }
}
