/** state tree
 * {
 *   view: {
 *     appBarTitle: string, app bar的标题
 *     navigationViewSelectedIndex: int, navigation view 菜单选择索引
 *   }
 * }
 */

import { combineReducers } from 'redux'

import view from './view'

const rootReducer = combineReducers({
  view
})

export default rootReducer
