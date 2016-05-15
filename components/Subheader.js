import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

class Subheader extends Component {
  
  static propTypes = {
    text: PropTypes.string.isRequired,
    leftPadding: PropTypes.number
  }

  static defaultProps = {
    leftPadding: 0
  }
  
  render() {
    const { leftPadding } = this.props

    return (
      <View style={[styles.root, {paddingLeft: leftPadding}]}>
        <Text style={styles.text} numberOfLines={1}>{this.props.text}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    height: 48,
    padding: 16
  },
  text: {
    color: 'black',
    opacity: 0.54,
    fontWeight: '600'
  }
})

export default Subheader
