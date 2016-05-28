import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  DrawerLayoutAndroid,
  Navigator,
  BackAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { Colors } from '../assets/Theme'
import NavigationView from '../components/NavigationView'
import router from '../helpers/router'
import { setNavIndex } from '../actions/view'
import { batchActions } from 'redux-batched-actions'
import { swipeWithoutGestures } from '../constants/sceneConfigure'
import KeyboardAndroid from '../components/KeyboardAndroid';

class Main extends Component {

  openDrawer = () => {
    this.drawer.openDrawer()
  }

  onNavItemPress = (index, title) => {
    const { dispatch } = this.props

    if (index == 0) {
      this.navigator.replace(router.schedule)
    } else {
      this.navigator.replace(router.history)
    }

    dispatch(setNavIndex(index))
    this.drawer.closeDrawer()
  }

  onProfilePress = () => {
    this.drawer.closeDrawer()
    this.navigator.push(router.login)
  }

  onHardwareBackPress = () => {
    console.log('root back press');
    const currentRoutes = this.navigator.getCurrentRoutes()
    if (currentRoutes.length > 1) {
      this.navigator.pop()
      return true
    }

    return false
  }
  
  onKeyboardChanged = (isVisible) => {
    console.log('keyboard is ' + isVisible);
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onHardwareBackPress)
    KeyboardAndroid.addEventListener('visibleChange', this.onKeyboardChanged)
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
    KeyboardAndroid.removeEventListener('visibleChange', this.onKeyboardChanged)
  }

  configureScene = (route) => {
    return route.configureScene || swipeWithoutGestures
  }

  renderScene = (route, navigator) => {
    const Comp = route.component
    const props = route.props
    return (
      <Comp navigator={navigator} openDrawer={this.openDrawer} {...props} />
    );
  }

  render() {
    const { selectedIndex, lockMode } = this.props

    var navigationView = (
      <NavigationView
        selectedIndex={selectedIndex}
        onNavItemPress={this.onNavItemPress}
        onProfilePress={this.onProfilePress}
      />
    )

    // console.log('instanceof' + (navigationView.type === NavigationView))
    return (
      <DrawerLayoutAndroid
        renderNavigationView={() => {
          return navigationView
        }}
        drawerWidth={300}
        drawerLockMode={lockMode}
        ref={drawer => this.drawer = drawer}
      >
        <StatusBar
          backgroundColor={Colors.primary700}
        />
        <Navigator
          initialRoute={router.initialPage}
          configureScene={this.configureScene}
          renderScene={this.renderScene}
          ref={r => this.navigator = r}
        />
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  
});

function select(state) {
  return {
    selectedIndex: state.view.navigationViewSelectedIndex,
    lockMode: state.view.drawerLockMode
  }
}

export default connect(select)(Main)
