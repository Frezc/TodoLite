import {
  DeviceEventEmitter
} from 'react-native';

const showListeners = new Set()
const hideListeners = new Set()

Keyboard = {

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

DeviceEventEmitter.addListener('keyboardDidShow', Keyboard.onKeyboardDidShow)
DeviceEventEmitter.addListener('keyboardDidHide', Keyboard.onKeyboardDidHide)

export default Keyboard
