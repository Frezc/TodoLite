/**
 * Created by Frezc on 2016/6/8.
 */

import { FETCH_SCHEDULE_SUCCESS, FETCH_SCHEDULE_LOCAL, UPDATE_TODO, ADD_TODO, LOGOUT } from '../constants/actionTypes'

function todos(state = {}, action) {
  switch (action.type) {
    case FETCH_SCHEDULE_SUCCESS:
      const todos = {}
      action.payload.todolist.map(todo => {
        todos[todo.id] = todo
      })
      return todos
    
    case FETCH_SCHEDULE_LOCAL:
      return action.payload.todos
    
    case UPDATE_TODO:
    case ADD_TODO:
      return Object.assign({}, state, {
        [action.payload.id]: action.payload
      })
    case LOGOUT:
      return {}
  }
  return state
}

export default todos
