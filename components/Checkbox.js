import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  TouchableNativeFeedback,
  LayoutAnimation
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

class Checkbox extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    size: PropTypes.number,
    onPress: PropTypes.func,
    color: PropTypes.string,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    checked: false,
    size: 20,
    disabled: false
  }

  state = {
    opacity: this.props.checked ? 1 : 0,
    size: 20
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.disabled && nextProps.checked !== this.props.checked) {
      LayoutAnimation.configureNext(CheckScaleSpring)
    }
  }

  render() {
    const { checked, size, style, onPress, color, disabled } = this.props;

    let touchProps
    if (disabled) touchProps = {}
    else touchProps = {
      onPress
    }
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        {...touchProps}
      >
        <View style={style}>
          <Icon name="check-box-outline-blank" size={size} />
          {checked && <Icon style={styles.ab} name="check-box" size={size} color={color} />}
        </View>
      </TouchableNativeFeedback>
    )
  }
}

const styles = StyleSheet.create({
  ab: {
    position: 'absolute',
    top: 0,
    left: 0
  }
})

const CheckScaleSpring = {
  duration: 400,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7,
  },
};

export default Checkbox
