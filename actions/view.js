import { SET_NAV_INDEX, SET_DRAWER_LOCKMODE, SET_PAGE_LOADING } from '../constants/actionTypes'

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

/**
 * @param page page can be one of ['schedulePage']
 * @param isLoading is loading now
 */
export function setPageLoading(page, isLoading = true) {
  return {
    type: SET_PAGE_LOADING,
    page: page,
    loading: isLoading
  }
}
