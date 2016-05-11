/** state tree
 * {
 *   views: {
 *     
 *   }
 * }
 */

import { combineReducers } from 'redux'
import { TEST } from '../constants/actionTypes'

function test(state = "Hello", action) {
  switch (action.type) {
    case TEST:
      return action.text
  }

  return state
}

const rootReducer = combineReducers({
  test
})

export default rootReducer
