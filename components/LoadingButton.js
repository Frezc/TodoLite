import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  ProgressBarAndroid
} from 'react-native';
import { Colors } from '../assets/Theme'

class LoadingButton extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    text: PropTypes.string.isRequired,
    style: PropTypes.object,
    buttonStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
    progressBarStyle: PropTypes.object
  }

  static defaultProps = {
    loading: false,
    style: {},
    buttonTextStyle: {},
    buttonStyle: {},
    progressBarStyle: {}
  }

  renderButton() {
    const { style, buttonStyle, buttonTextStyle, text } = this.props;

    return (
      <TouchableNativeFeedback>
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
      <ProgressBarAndroid color={Colors.accent200} style={[styles.root, style, progressBarStyle]} />
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
