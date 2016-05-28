'use strict';
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');


var KeyboardAndroid = {

  componentWillMount: function() {
    this.addListenerOn(DeviceEventEmitter,
      'KeyboardVisibleChanged',
      this.onKeyboardVisibleChanged);
  },

  onKeyboardVisibleChanged: function(e) {
    console.log(e);
  }
}
