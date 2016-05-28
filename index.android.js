import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
import configureStore from './helpers/configureStore'
import { Provider } from 'react-redux'
import Main from './containers'

const store = configureStore()

function TodoLite() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

AppRegistry.registerComponent('TodoLite', () => TodoLite);
