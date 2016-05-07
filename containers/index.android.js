
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ToolbarAndroid
} from 'react-native';
import { connect } from 'react-redux'


class Main extends Component {

  render() {
    const { text, dispatch } = this.props

    return (
      <View style={styles.container}>
        <ToolbarAndroid
          logo={require('../assets/ic_menu_black_24dp.png')}
          title="Todo"
          actions={[{title: 'settings', show: 'always'}]}
          onActionSelected={() => {}}
          style={styles.toolbar}
        />
        <Text style={styles.welcome}>
          {text}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  toolbar: {
    height: 48,
    backgroundColor: 'white'
    // width: 48
  }
});

function select(state) {
  return {
    text: state.test
  }
}

export default connect(select)(Main)
