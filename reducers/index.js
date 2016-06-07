/** state tree
 * {
 *   view: {
 *     navigationViewSelectedIndex: int, navigation view 菜单选择索引,
 *     drawerLockMode: ('unlocked', 'locked-closed', 'locked-open'),
 *     schedulePage: {
 *       loading: bool,
 *       data: [to_do, ..]
 *     }
 *   },
 *   auth: {
 *     user: {
 *       id: number,
 *       nickname: string,
 *       email: string,
 *       created_at: string
 *     },
 *     token: string
 *   },
 *   
 *   // model
 *   to_do: {
 *     id,
 *     user_id,
 *     title,
 *     status,
 *     type,
 *     start_at,
 *     urgent_at,
 *     deadline,
 *     priority,
 *     location,
 *     end_at,
 *     contents: [{
 *       content: text,
 *       status: string
 *     }]
 *     created_at,
 *     updated_at
 *   }
 * }
 */

import { combineReducers } from 'redux'

import view from './view'
import auth from './auth'

const rootReducer = combineReducers({
  view,
  auth
})

export default rootReducer
