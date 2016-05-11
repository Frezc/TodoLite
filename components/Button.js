import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback
} from 'react-native';
import { Colors } from '../assets/Theme'

class Button extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    textStyle: PropTypes.object
  }

  static defaultProps = {
    count: 0,
    disabled: false,
    style: {},
    textStyle: {}
  }

  render() {
    const { text, style, textStyle, disabled } = this.props;

    const textStyles = [styles.text, textStyle, {color: disabled ? 'darkgray' : Colors.accent200}]

    return (
      <TouchableNativeFeedback disabled={disabled}>
        <View style={[styles.root, style]}>
          <Text style={textStyles}>
            {text}
          </Text>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    width: 80,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontWeight: '600'
  }
})

export default Button
