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
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from '../assets/Theme'
import NavigationView from '../components/NavigationView'
import LoginPage from './LoginPage'

class Main extends Component {

  renderScene = (route, navigator) => {
    return (
      <LoginPage />
    );
  }

  render() {
    const { text, dispatch } = this.props

    var navigationView = (
      <NavigationView
        selectedIndex={0}
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
        <Icon.ToolbarAndroid
          navIconName="android-menu"
          iconColor="white"
          title="Todo"
          titleColor="white"
          style={styles.toolbar}
          onIconClicked={() => this.drawer.openDrawer()}
        />
        <Navigator
          initialRoute={{}}
          configureScene={(route) => {
            return Navigator.SceneConfigs.FadeAndroid;
          }}
          renderScene={this.renderScene}
        />
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  toolbar: {
    height: 56,
    backgroundColor: Colors.primary500
  }
});

function select(state) {
  return {
    text: state.test
  }
}

export default connect(select)(Main)
