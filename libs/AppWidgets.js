import React from 'react'
import { DeviceEventEmitter, NativeModules } from 'react-native'

const AppWidgetsModule = NativeModules.AppWidgetsModule

const AppWidgets = {
  update: AppWidgetsModule.update,
  addListener: function(type, listener) {
    switch (type) {
      case 'press':
      case 'click':
        DeviceEventEmitter.addListener('sysModuleAppWidgetsClick', listener);

        AppWidgetsModule.getInitialSysAppWidgets(function(initialSysAppWidgetId,
                                                              initialSysAppWidgetAction, 
                                                              initialSysAppWidgetPayload) {
          if (initialSysAppWidgetId) {
            var event = {
              id: initialSysAppWidgetId,
              action: initialSysAppWidgetAction,
              payload: JSON.parse(initialSysAppWidgetPayload)
            }

            listener(event);
            
            AppWidgetsModule.removeInitialSysAppWidgets();
          }
        });
        
        break;
    }
  },

  removeAllListeners: function (type) {
    switch (type) {
      case 'press':
      case 'click':
        DeviceEventEmitter.removeAllListeners('sysModuleAppWidgetsClick');
        break;
    }
  }
}

export default AppWidgets
