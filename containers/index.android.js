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
import { setAppBarTitle, setNavIndex } from '../actions/view'
import { batchActions } from 'redux-batched-actions'

const sceneConfig = Navigator.SceneConfigs.HorizontalSwipeJump
sceneConfig.gestures = {}

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

    dispatch(batchActions([setAppBarTitle(title), setNavIndex(index)]))
    this.drawer.closeDrawer()
  }

  onProfilePress = () => {
    this.drawer.closeDrawer()
    this.navigator.push(router.login)
  }

  onHardwareBackPress = () => {
    const currentRoutes = this.navigator.getCurrentRoutes()
    if (currentRoutes.length > 1) {
      this.navigator.pop()
      return true
    }

    return false
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onHardwareBackPress)
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
  }

  renderScene = (route, navigator) => {
    const Comp = route.component
    const props = route.props
    return (
      <Comp navigator={navigator} openDrawer={this.openDrawer} {...props} />
    );
  }

  render() {
    const { selectedIndex } = this.props

    var navigationView = (
      <NavigationView
        selectedIndex={selectedIndex}
        onNavItemPress={this.onNavItemPress}
        onProfilePress={this.onProfilePress}
      />
    )
    return (
      <DrawerLayoutAndroid
        renderNavigationView={() => {
          return navigationView
        }}
        drawerWidth={300}
        ref={drawer => this.drawer = drawer}
      >
        <StatusBar
          backgroundColor={Colors.primary700}
        />
        <Navigator
          initialRoute={router.initialPage}
          configureScene={(route) => {
            return sceneConfig
          }}
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
    selectedIndex: state.view.navigationViewSelectedIndex
  }
}

export default connect(select)(Main)
