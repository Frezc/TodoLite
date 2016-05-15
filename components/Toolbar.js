import React, { Component, PropTypes } from 'react'
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Colors } from '../assets/Theme'

class Toolbar extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    navIconName: PropTypes.string,
    onIconClicked: PropTypes.func
  }

  render() {
    return (
      <Icon.ToolbarAndroid
        {...this.props}
        iconColor="white"
        titleColor="white"
        style={styles.toolbar}
      />
    )
  }
}

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    backgroundColor: Colors.primary500,
    elevation: 2
  }
});

export default Toolbar
