import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

class Divider extends Component {

  static propTypes = {
    // 通过StyleSheet创建的style实际上是一个数字标识
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
  }

  static defaultProps = {
    style: {}
  }

  render() {
    return (
      <View style={[styles.divider, this.props.style]} />
    )
  }
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: 'black',
    opacity: 0.12,
    height: 1,
    alignSelf: 'stretch'
  }
})

export default Divider
