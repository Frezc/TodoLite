import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Slider
} from 'react-native';

class SliderWithIndicator extends Component {

  // propTypes are same as Slider

  constructor(props) {
    super(props)
    
    this.state = {
      value: props.value
    }
  }
  
  calculateTextOffset = (value) => {
    const { maximumValue, minimumValue } = this.props
    const percent = (value - minimumValue) / (maximumValue - minimumValue)
    return (240 - 12) * percent + 12
  }

  render() {
    const { onValueChange, style } = this.props
    const sliderProps = Object.assign({}, this.props, {
      style: {},
      onValueChange: value => {
        this.setState({
          value
        })
        onValueChange(value)
      }
    })

    return (
      <View style={style}>
        <Text
          style={[styles.text, { left: this.calculateTextOffset(this.state.value)}]}
        >{this.state.value}</Text>
        <Slider
          {...sliderProps}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    top: -18
  }
})

export default SliderWithIndicator
