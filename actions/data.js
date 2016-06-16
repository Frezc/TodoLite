/**
 * Created by Frezc on 2016/6/8.
 */
import { AsyncStorage } from 'react-native'

export function saveSchedule() {
  return (dispatch, getState) => {
    const sp = getState().view.schedulePage
    sp.ready = true
    return AsyncStorage.setItem('schedule', JSON.stringify(sp))
      .then(err => {
        console.log('err ' + err)
        return err
      })
  }
}

export function saveTodos() {
  return (dispatch, getState) => {
    const todos = getState().todos
    return AsyncStorage.setItem('todos', JSON.stringify(todos))
      .then(err => {
        console.log('err ' + err)
        return err
      })
  }
}

export function saveScheduleAndTodos() {
  return (dispatch) => {
    return Promise.all([dispatch(saveSchedule()), dispatch(saveTodos())])
      .then(err => {
        console.log('err ' + err)
        return err
      })
  }

}

export function saveHistory() {
  return (dispatch, getState) => {
    const hp = getState().view.historyPage
    hp.ready = true
    return AsyncStorage.setItem('history', JSON.stringify(hp))
      .then(err => {
        console.log('err ' + err)
        return err
      })
  }
}
