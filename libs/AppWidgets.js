import React from 'react'
import { DeviceEventEmitter, NativeModules } from 'react-native'

const AppWidgetsModule = NativeModules.AppWidgetsModule

const APPWIDGET_CLICK = "AppWidgetClick"
const APPWIDGET_EMPTY_CLICK = "AppWidgetEmptyClick"

const listeners = new Map()
listeners.set(APPWIDGET_CLICK, new Set())
listeners.set(APPWIDGET_EMPTY_CLICK, new Set())

const AppWidgets = {
  APPWIDGET_CLICK: APPWIDGET_CLICK,
  APPWIDGET_EMPTY_CLICK: APPWIDGET_EMPTY_CLICK,

  listeners: listeners,

  update: AppWidgetsModule.update,

  addListener: function(action, listener) {
    switch (action) {
      case APPWIDGET_CLICK:
      case APPWIDGET_EMPTY_CLICK:
        this.listeners.get(action).add(listener)
        this.initialListener(action, listener)
        break
    }
  },

  initialListener: function (action, listener) {
    AppWidgetsModule.getInitialSysAppWidgets(function(initialSysAppWidgetAction, initialSysAppWidgetPayload) {
      if (initialSysAppWidgetAction == action) {
        var event = {
          action: initialSysAppWidgetAction,
          payload: JSON.parse(initialSysAppWidgetPayload)
        }

        listener(event);

        AppWidgetsModule.removeInitialSysAppWidgets();
      }
    });
  },

  removeListener: function (action, listener) {
    switch (action) {
      case APPWIDGET_CLICK:
      case APPWIDGET_EMPTY_CLICK:
        this.listeners.get(action).delete(listener)
        break;
    }
  },

  removeAllListeners: function () {
    this.listeners.clear()
  },

  eventListener: function (event) {
    switch (event.action) {
      case APPWIDGET_CLICK:
      case APPWIDGET_EMPTY_CLICK:
        for(const listener of this.listeners.get(event.action)) {
          listener(event)
        }
        break
    }
  }
}

DeviceEventEmitter.addListener('sysModuleAppWidgetsClick', AppWidgets.eventListener);

export default AppWidgets
