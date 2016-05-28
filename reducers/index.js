/** state tree
 * {
 *   view: {
 *     navigationViewSelectedIndex: int, navigation view 菜单选择索引,
 *     drawerLockMode: ('unlocked', 'locked-closed', 'locked-open') 
 *   }
 * }
 */

import { combineReducers } from 'redux'

import view from './view'

const rootReducer = combineReducers({
  view
})

export default rootReducer
