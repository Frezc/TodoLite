/** state tree
 * {
 *   view: {
 *     navigationViewSelectedIndex: int, navigation view 菜单选择索引,
 *     drawerLockMode: ('unlocked', 'locked-closed', 'locked-open'),
 *     schedulePage: {
 *       loading: bool,
 *       data: [todo_id, ..],
 *       statusFilter: string,
 *       typeFilter: string,
 *       searchText: string
 *     },
 *     historyPage: {
 *       loading: bool,
 *       all: number,       // total of data
 *       data: [..todos],   // immutable data
 *       statusFilter: string,
 *       typeFilter: string,
 *       searchText: string,
 *       year: number     
 *     },
 *     dialog: {
 *       // see DialogCover 's propTypes
 *       visible: bool,
 *       content: element,
 *       title,
 *       actions,
 *       onRequestClose,
 *       noPadding
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
 *   todos: {
 *     [todo_id]: {
 *       id,
 *       user_id,
 *       title,
 *       status,
 *       type,
 *       start_at,
 *       urgent_at,
 *       deadline,
 *       priority,
 *       location,
 *       end_at,
 *       contents: [{
 *         content: text,
 *         status: string
 *       }]
 *       created_at,
 *       updated_at
 *     }
 *   }
 * }
 */

import { combineReducers } from 'redux'

import view from './view'
import auth from './auth'
import todos from './todos'

const rootReducer = combineReducers({
  view,
  auth,
  todos
})

export default rootReducer
