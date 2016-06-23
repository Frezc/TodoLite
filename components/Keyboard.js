import {
  Keyboard
} from 'react-native';

const showListeners = new Set()
const hideListeners = new Set()

const KeyboardEvent = {

  addEventListener: (eventName, listener) => {
    if (eventName === 'keyboardDidShow') {
      showListeners.add(listener)
    } else if (eventName === 'keyboardDidHide') {
      hideListeners.add(listener)
    }
  },

  /**
   * @returns {boolean} if removed successfully
   */
  removeEventListener: (eventName, listener) => {
    if (eventName === 'keyboardDidShow') {
      return showListeners.delete(listener)
    } else if (eventName === 'keyboardDidHide') {
      return hideListeners.delete(listener)
    }
    return false
  },

  onKeyboardDidShow: () => {
    for (const listener of showListeners) {
      listener()
    }
  },

  onKeyboardDidHide: () => {
    for (const listener of hideListeners) {
      listener()
    }
  }
}

Keyboard.addListener('keyboardDidShow', KeyboardEvent.onKeyboardDidShow)
Keyboard.addListener('keyboardDidHide', KeyboardEvent.onKeyboardDidHide)

export default KeyboardEvent
