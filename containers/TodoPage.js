import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
  Navigator,
  Picker,
  ToastAndroid,
  BackAndroid
} from 'react-native';
import { Colors, statusColors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'
import Subheader from '../components/Subheader'
import Divider from '../components/Divider'
import Section from '../components/MultiLinesSection'
import SingleLineSection from '../components/SingleLineSection'
import Checkbox from '../components/Checkbox'
import { TypeIcon, StatusText } from '../constants'
import DialogCover from '../components/DialogCoverM'
import SelectableList from '../components/SelectableList'
import SliderWithIndicator from '../components/SliderWithIndicator'
import DatePicker from '../components/DatePicker'
import Button from '../components/Button'
import { setDrawerLockMode } from '../actions/view'
import { connect } from 'react-redux';
import dismissKeyboard from 'dismissKeyboard'

class TodoPage extends Component {

  state = {
    modified: false
  }

  temp = {
    title: '',
    priority: 5,
    location: '',
    contents: ["是TesttTesttestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是TesttTesttestes车尺"]
  }

  showTitleDialog = () => {
    this.dialog.show({
      title: 'Title',
      content: (
        <TextInput
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          autoFocus
          defaultValue={this.temp.title}
          maxLength={30}
          onChangeText={text => {this.temp.title = text; dismissKeyboard()}}
          onFocus={() => {
            console.log('on focus');
            this.dialog.fitKeyboard(true)
          }}
          onBlur={() => {
            console.log('on blur');
            this.dialog.fitKeyboard(false)
          }}
          onEndEditing={() => {
            console.log('end editing');
          }}
        />
      ),
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'OK',
        onPress: () => {
          console.log(this.temp.title)
        }
      }]
    })
  }

  showTypeDialog = () => {
    this.dialog.show({
      title: 'Type',
      noPadding: true,
      content: (
        <SelectableList
          selectedText="haha"
          list={[{
            iconName: 'email',
            text: 'email'
          }, {
            iconName: 'email',
            text: 'haha'
          }, {
            text: 'no icon'
          }]}
          onSelected={this.onSelectType}
        />
      )
    })
  }

  showPriorityDialog = () => {
    this.dialog.show({
      title: 'Priority',
      noPadding: true,
      content: (
        <SliderWithIndicator
          style={{ margin: 10 }}
          maximumValue={9}
          minimumValue={1}
          step={1}
          value={5}
          onValueChange={value => {
            console.log(value)
          }}
        />
      ),
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'OK',
        onPress: () => {
        }
      }]
    })
  }

  showLocationDialog = () => {
    this.dialog.show({
      title: 'Location',
      content: (
        <TextInput
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          autoFocus
          defaultValue={this.temp.title}
          maxLength={255}
          onChangeText={text => this.temp.location = text}
        />
      ),
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'OK',
        onPress: () => {
        }
      }]
    })
  }

  showContentDialog = () => {
    this.dialog.show({
      content: (
        <TextInput
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          multiline
          numberOfLines={12}
          defaultValue={this.temp.contents[0]}
          onChangeText={text => this.temp.contents[0] = text}
        />
      ),
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'OK',
        onPress: () => {
        }
      }]
    })
  }

  setStartAt = () => {
    this.dialog.show({
      title: 'Start At',
      content: (
        <DatePicker
        />
      ),
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'OK',
        onPress: () => {
        }
      }]
    })
  }

  setDeadline = () => {

  }

  addContent = () => {

  }

  onComplete = () => {

  }

  onLaySide = () => {

  }

  onSelectType = type => {
    this.onCloseDialog()
  }

  onCloseDialog = () => {
    this.dialog.close()
  }

  onBackPress = () => {
    const { navigator } = this.props

    navigator.pop()
  }

  onScroll = (e) => {
    // console.log(e.nativeEvent.contentOffset.y)
    // console.log(this.title)
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setDrawerLockMode('locked-closed'))
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setDrawerLockMode('unlocked'))
  }

  renderActions() {
    return (
      <View style={styles.actions}>
        <Button
          text="Complete"
          type="raise"
          color={statusColors[1]}
          style={styles.action}
          onPress={this.onComplete}
        />
        <Button
          text="Lay Side"
          type="raise"
          color={statusColors[2]}
          style={styles.action}
          onPress={this.onLaySide}
        />
      </View>
    )
  }

  renderContent() {
    const { navigator } = this.props;

    return (
      <ScrollView style={styles.fillParent} onScroll={this.onScroll}>
        <Section
          text="Title"
          secondText="Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是"
          ref={r => this.title = r}
          onPress={this.showTitleDialog}
        />
        <Divider style={styles.divider} />
        <Section
          text="Type"
          secondText="default"
          iconName={TypeIcon['default']}
          onPress={this.showTypeDialog}
        />
        <Section
          text="Status"
          secondText={StatusText[0]}
        />
        <Section
          text="Priority"
          secondText="5"
          onPress={this.showPriorityDialog}
        />
        <Divider style={styles.divider} />
        <Section
          text="Start at"
          secondText="2016 1 21 21:02:00"
          iconName="access-time"
          onPress={this.setStartAt}
        />
        <Section
          text="Deadline"
          secondText="2016 1 21 21:02:00"
          iconName="alarm"
          onPress={this.setDeadline}
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
          onPress={this.showLocationDialog}
        />
        <Divider style={styles.divider} />
        <Subheader
          text="Contents"
          leftPadding={68}
        />
        <SingleLineSection
          text="Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Tes"
          leftElement={<Checkbox style={styles.leftEl} color={Colors.accent100} />}
          onPress={this.showContentDialog}
        />
        <SingleLineSection
          text="Add Content"
          iconName="add"
          onPress={this.addContent}
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
        {this.renderActions()}
        <DialogCover
          actions={[]}
          onRequestClose={this.onCloseDialog}
          ref={r => this.dialog = r}
        >
          <Text>123</Text>
        </DialogCover>
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
  },
  actions: {
    flexDirection: 'row'
  },
  action: {
    flex: 1,
    height: 42
  }
})

function select (state, ownProps) {
  return {

  }
}

export default connect(select)(TodoPage)
