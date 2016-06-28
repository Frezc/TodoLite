import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  DrawerLayoutAndroid,
  Navigator,
  BackAndroid,
  ToastAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { Colors } from '../assets/Theme'
import NavigationView from '../components/NavigationView'
import router from '../helpers/router'
import { setNavIndex } from '../actions/view'
import { swipeWithoutGestures } from '../constants/sceneConfigure'
import DialogCover from '../components/DialogCover'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'

class Main extends Component {

  canExit = false

  openDrawer = () => {
    this.drawer.openDrawer()
  }

  onNavItemPress = (index, title) => {
    const { dispatch } = this.props

    switch (index) {
      case 0:
        this.navigator.replace(router.schedule)
        break
      case 1:
        this.navigator.replace(router.history)
        break
      case 2:
        this.navigator.push(router.settings)
        break
    }

    if (index == 0 || index == 1) {
      dispatch(setNavIndex(index))
    }
    this.drawer.closeDrawer()
  }

  onProfilePress = () => {
    const { token } = this.props
    this.drawer.closeDrawer()
    if (token) {
      this.navigator.push(router.profile)      
    } else {
      this.navigator.push(router.login)
    }
  }

  onHardwareBackPress = () => {
    console.log('root back press');
    const currentRoutes = this.navigator.getCurrentRoutes()
    if (currentRoutes.length > 1) {
      this.navigator.pop()
      return true
    } else if (this.canExit) {
      return false
    } else {
      ToastAndroid.show('Press back again to exit app.', ToastAndroid.SHORT)
      this.canExit = true
      this.setTimeout(() => this.canExit = false, 2000)
      return true
    }
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onHardwareBackPress)
    // AppWidgets.addListener('press', event => {
    //   ToastAndroid.show(`Action: ${event.action}`, ToastAndroid.LONG)
    //   if (event.action == AppWidgets.APPWIDGET_CLICK) {
    //     ToastAndroid.show(`You press todo id: ${event.payload.id} action: ${event.action}`, ToastAndroid.LONG)
    //   }
    // })
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
      <Comp 
        navigator={navigator}
        openDrawer={this.openDrawer}
        dialog={this.dialog}
        {...props}
      />
    );
  }

  render() {
    const { selectedIndex, lockMode, user, dialog } = this.props

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
        <DialogCover
          ref={r => this.dialog = r}
          {...dialog}
        >
          {dialog.content}
        </DialogCover>
      </DrawerLayoutAndroid>
    );
  }
}

reactMixin(Main.prototype, TimerMixin)

const styles = StyleSheet.create({
  
});

function select(state) {
  return {
    selectedIndex: state.view.navigationViewSelectedIndex,
    lockMode: state.view.drawerLockMode,
    user: state.auth.user,
    token: state.auth.token,
    dialog: state.view.dialog
  }
}

export default connect(select)(Main)
