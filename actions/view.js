import { SET_NAV_INDEX, SET_DRAWER_LOCKMODE } from '../constants/actionTypes'

export function setNavIndex(index) {
  return {
    type: SET_NAV_INDEX,
    payload: index
  }
}

export function setDrawerLockMode(mode) {
  return {
    type: SET_DRAWER_LOCKMODE,
    payload: mode
  }
}
