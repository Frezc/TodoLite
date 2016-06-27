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
    text: PropTypes.any.isRequired,  // string, number
    color: PropTypes.string,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(['flat', 'raise']),
    onPress: PropTypes.func
  }

  static defaultProps = {
    color: Colors.accent200,
    disabled: false,
    type: 'flat',
    style: {},
    textStyle: {}
  }

  render() {
    const { text, style, textStyle, color, disabled, type, onPress } = this.props;

    let rootStyles = [styles.root, style]
    let textStyles = [styles.text, textStyle]

    if (type == 'raise') {
      rootStyles.push({ backgroundColor: disabled ? 'darkgray' : color })
    } else {
      textStyles.push({color: disabled ? 'darkgray' : color })
    }

    return (
      <TouchableNativeFeedback disabled={disabled} onPress={onPress}>
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
    width: 64,
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
