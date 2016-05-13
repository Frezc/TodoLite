import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Button from '../components/Button'

class NeedAuthPage extends Component {

  render() {
    return (
      <View style={styles.page}>
        <Text style={styles.text}>
          This page need to auth.
        </Text>
        <Button
          text="LOGIN"
          type="raise"
          style={styles.button}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    padding: 32
  },
  text: {
    marginTop: 32,
    opacity: 0.87,
    fontSize: 16
  },
  button: {
    marginTop: 32,
    width: 106,
    height: 42
  }
})

export default NeedAuthPage
