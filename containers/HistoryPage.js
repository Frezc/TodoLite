import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableNativeFeedback
} from 'react-native';
import Toolbar from '../components/Toolbar'

class HistoryPage extends Component {

  render() {
    const { openDrawer } = this.props

    return (
      <View>
        <Toolbar
          navIconName="menu"
          title={'History'}
          onIconClicked={openDrawer}
        />
        <Text>HistoryPage</Text>
      </View>
    )
  }
}

export default HistoryPage
