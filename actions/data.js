/**
 * Created by Frezc on 2016/6/8.
 */
import { AsyncStorage } from 'react-native'

export function saveSchedule(rootState) {
  const sp = rootState.view.schedulePage
  return AsyncStorage.setItem('schedule', JSON.stringify(sp))
    .then(err => {
      console.log('err ' + err)
      return err
    })
}

export function saveTodos(rootState) {
  const todos = rootState.todos
  return AsyncStorage.setItem('todos', JSON.stringify(todos))
    .then(err => {
      console.log('err ' + err)
      return err
    })
}

export function saveScheduleAndTodos(rootState) {
  return Promise.all([saveSchedule(rootState), saveTodos(rootState)])
    .then(err => {
      console.log('err ' + err)
      return err
    })
}
