import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  ActivityIndicator
} from 'react-native';
import { Colors } from '../assets/Theme'

class LoadingButton extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    text: PropTypes.string.isRequired,
    style: PropTypes.any,
    buttonStyle: PropTypes.any,
    buttonTextStyle: PropTypes.any,
    progressBarStyle: PropTypes.any,
    onPress: PropTypes.func
  }

  static defaultProps = {
    loading: false
  }

  renderButton() {
    const { style, buttonStyle, buttonTextStyle, text, onPress } = this.props;

    return (
      <TouchableNativeFeedback onPress={onPress}>
        <View style={[styles.root, style, buttonStyle]}>
          <Text style={buttonTextStyle}>
            {text}
          </Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderLoading() {
    const { style, progressBarStyle } = this.props;

    return (
      <ActivityIndicator color={Colors.accent200} style={[styles.root, style, progressBarStyle]} />
    )
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return this.renderLoading();
    } else {
      return this.renderButton();
    }
  }
}

const styles = StyleSheet.create({
  root: {
    height: 36,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default LoadingButton;
