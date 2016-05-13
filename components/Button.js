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
    type: PropTypes.oneOf(['flat', 'raise']),
    style: PropTypes.object,
    textStyle: PropTypes.object
  }

  static defaultProps = {
    count: 0,
    disabled: false,
    type: 'flat',
    style: {},
    textStyle: {}
  }

  render() {
    const { text, style, textStyle, disabled, type } = this.props;

    let rootStyles = [styles.root, style]
    let textStyles = [styles.text, textStyle]

    if (type == 'raise') {
      rootStyles.push({ backgroundColor: disabled ? 'darkgray' : Colors.accent200 })
    } else {
      textStyles.push({color: disabled ? 'darkgray' : Colors.accent200})
    }

    return (
      <TouchableNativeFeedback disabled={disabled}>
        <View style={rootStyles}>
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
    fontWeight: '600',
    color: 'white'
  }
})

export default Button
