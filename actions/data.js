/**
 * Created by Frezc on 2016/6/8.
 */
import { AsyncStorage } from 'react-native'

export function saveSchedule(rootState) {
  const scheduleData = rootState.view.schedulePage.data
  const saveData = {
    data: scheduleData,
    todos: rootState.todos
  }
  console.log(JSON.stringify(saveData));
  return AsyncStorage.setItem('schedule', JSON.stringify(saveData))
    .then(err => {
      console.log('err ' + err)
      return err
    })
}
