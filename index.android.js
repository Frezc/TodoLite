import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
import configureStore from './helpers/configureStore'
import { Provider } from 'react-redux'
import Main from './containers'
import './components/Keyboard'
import { appStart } from './actions/network'

const store = configureStore()

function TodoLite() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

store.dispatch(appStart())

AppRegistry.registerComponent('TodoLite', () => TodoLite);
