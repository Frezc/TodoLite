import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  TouchableNativeFeedback
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

class Checkbox extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    size: PropTypes.number,
    onPress: PropTypes.func,
    color: PropTypes.string
  }

  static defaultProps = {
    checked: false,
    size: 20
  }


  render() {
    const { checked, size, style, onPress, color } = this.props;

    const iconParams = {
      name: checked ? 'check-box' : "check-box-outline-blank",
      size: size
    }

    if (checked) iconParams.color = color;

    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        onPress={onPress}
      >
        <View style={style}>
          <Icon {...iconParams} />
        </View>
      </TouchableNativeFeedback>
    )
  }
}

const styles = StyleSheet.create({

})

export default Checkbox
