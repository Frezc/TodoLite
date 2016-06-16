/**
 * Created by Frezc on 2016/6/15.
 */

import React, { Component, PropTypes } from 'react';
import {
  Picker,
  ToastAndroid
} from 'react-native';

class UncPicker extends Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape(Picker.Item.propTypes)),
    defaultValue: PropTypes.any,
    onValueChange: PropTypes.func
  }
  
  static defaultProps = {
    items: []
  }

  state = {
    value: this.props.defaultValue
  }

  /**
   * This will be called when initial
   * @param value
   * @param index
   */
  onValueChange = (value, index) => {
    const { onValueChange } = this.props
    this.setState({
      value
    })
    
    onValueChange && onValueChange(value, index)
  }

  render() {
    return (
      <Picker 
        {...this.props} 
        selectedValue={this.state.value}
        onValueChange={this.onValueChange}
      >
        {this.props.items.map((item, index) =>
          <Picker.Item key={index} {...item} />
        )}
      </Picker>
    )
  }
}

export default UncPicker
