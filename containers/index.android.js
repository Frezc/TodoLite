import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  DrawerLayoutAndroid,
  Navigator
} from 'react-native';
import { connect } from 'react-redux';
import { Colors } from '../assets/Theme'
import NavigationView from '../components/NavigationView'
import router from '../helpers/router'
import { setAppBarTitle, setNavIndex } from '../actions/view'
import { batchActions } from 'redux-batched-actions'

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

  renderScene = (route, navigator) => {
    const Comp = route.component
    return (
      <Comp navigator={navigator} openDrawer={this.openDrawer} />
    );
  }

  render() {
    const { selectedIndex } = this.props

    var navigationView = (
      <NavigationView
        selectedIndex={selectedIndex}
        onNavItemPress={this.onNavItemPress}
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
            return Navigator.SceneConfigs.FadeAndroid;
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
