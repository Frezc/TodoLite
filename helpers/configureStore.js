import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import { enableBatching } from 'redux-batched-actions'

const loggerMiddleware = createLogger()

export default function () {
  return createStore(enableBatching(rootReducer), applyMiddleware(thunkMiddleware, loggerMiddleware))
}
