import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableNativeFeedback
} from 'react-native';
import { Colors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'
import Subheader from '../components/Subheader'
import Divider from '../components/Divider'
import Section from '../components/MultiLinesSection'
import { TypeIcon, StatusText } from '../constants'

class TodoPage extends Component {

  onBackPress = () => {
    const { navigator } = this.props

    navigator.pop()
  }

  renderContent() {
    return (
      <ScrollView style={styles.fillParent}>
        <Section
          text="Title"
          secondText="Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是"
        />
        <Divider style={styles.divider} />
        <Section
          text="Type"
          secondText="default"
          iconName={TypeIcon['default']}
        />
        <Section
          text="Status"
          secondText={StatusText[0]}
        />
        <Section
          text="Priority"
          secondText="5"
        />
        <Divider style={styles.divider} />
        <Section
          text="Start at"
          secondText="2016 1 21 21:02:00"
          iconName="access-time"
        />
        <Section
          text="Deadline"
          secondText="2016 1 21 21:02:00"
          iconName="alarm"
        />
        <Section
          text="End at"
          secondText="2016 1 21 21:02:00"
          iconName="alarm-on"
        />
        <Divider style={styles.divider} />
        <Section
          text="Location"
          secondText="杭州电子科技大学"
          iconName="location-on"
        />
        <Divider style={styles.divider} />
        <Subheader
          text="Contents"
          leftPadding={68}
        />
        <Section
          text="Location"
          secondText="杭州电子科技大学"
          iconName="location-on"
        />
      </ScrollView>
    )
  }

  render() {
    return (
      <View style={styles.fillParent}>
        <Toolbar
          navIconName="arrow-back"
          title=""
          onIconClicked={this.onBackPress}
        />
        {this.renderContent()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fillParent: {
    flex: 1
  },
  divider: {
    marginLeft: 68
  },
  section: {
    flexDirection: 'row'
  },
})

export default TodoPage
