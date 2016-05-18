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
import SingleLineSection from '../components/SingleLineSection'
import Checkbox from '../components/Checkbox'
import { TypeIcon, StatusText } from '../constants'

class TodoPage extends Component {

  onBackPress = () => {
    const { navigator } = this.props

    navigator.pop()
  }

  onScroll = (e) => {
    // console.log(e.nativeEvent.contentOffset.y)
    // console.log(this.title)
  }

  renderContent() {
    return (
      <ScrollView style={styles.fillParent} onScroll={this.onScroll}>
        <Section
          text="Title"
          secondText="Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是"
          ref={r => this.title = r}
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
        <SingleLineSection
          text="Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Tes"
          leftElement={<Checkbox style={styles.leftEl} color={Colors.accent100} />}
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
  leftEl: {
    marginLeft: 16,
    marginRight: 16,
    width: 20
  }
})

export default TodoPage
