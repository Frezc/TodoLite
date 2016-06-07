import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  DrawerLayoutAndroid,
  Navigator,
  BackAndroid,
  DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import { Colors } from '../assets/Theme'
import NavigationView from '../components/NavigationView'
import router from '../helpers/router'
import { setNavIndex } from '../actions/view'
import { logout } from '../actions/network'
import { batchActions } from 'redux-batched-actions'
import { swipeWithoutGestures } from '../constants/sceneConfigure'

class Main extends Component {

  openDrawer = () => {
    this.drawer.openDrawer()
  }

  onNavItemPress = (index, title) => {
    const { dispatch, token } = this.props

    switch (index) {
      case 0:
        this.navigator.replace(router.schedule)
        break
      case 1:
        this.navigator.replace(router.history)
        break
      case -1:
        dispatch(logout(token))
    }

    if (index != -1) {
      dispatch(setNavIndex(index))
    }
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

  componentWillMount() {
    const { dispatch } = this.props;
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onHardwareBackPress)
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onHardwareBackPress)

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
    const { selectedIndex, lockMode, user } = this.props

    var navigationView = (
      <NavigationView
        selectedIndex={selectedIndex}
        onNavItemPress={this.onNavItemPress}
        onProfilePress={this.onProfilePress}
        userInfo={user}
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
    lockMode: state.view.drawerLockMode,
    user: state.auth.user,
    token: state.auth.token
  }
}

export default connect(select)(Main)
