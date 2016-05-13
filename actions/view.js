import { SET_APPBAR_TITLE, SET_NAV_INDEX } from '../constants/actionTypes'

export function setAppBarTitle(title) {
  return {
    type: SET_APPBAR_TITLE,
    payload: title
  }
}

export function setNavIndex(index) {
  return {
    type: SET_NAV_INDEX,
    payload: index
  }
}
