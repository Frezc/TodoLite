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
  BackAndroid,
  RefreshControl,
  ProgressBarAndroid
} from 'react-native';
import { Colors, statusColors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'
import Subheader from '../components/Subheader'
import Divider from '../components/Divider'
import Section from '../components/MultiLinesSection'
import SingleLineSection from '../components/SingleLineSection'
import Checkbox from '../components/Checkbox'
import { TypeIcon, StatusText, TypeText } from '../constants'
import DialogCover from '../components/DialogCoverM'
import SelectableList from '../components/SelectableList'
import SliderWithIndicator from '../components/SliderWithIndicator'
import DatePicker from '../components/DatePicker'
import Button from '../components/Button'
import { setDrawerLockMode } from '../actions/view'
import { connect } from 'react-redux';
import dismissKeyboard from 'dismissKeyboard'
import Keyboard from '../components/Keyboard'
import router from '../helpers/router'
import { formatDate } from '../helpers'

const TypeDialogList = Object.keys(TypeIcon).map(type => {
  return {
    iconName: TypeIcon[type],
    text: TypeText[type]
  }
})

const Types = Object.keys(TypeIcon)

const ModifiedActions = [{
  title: 'Revert', iconName: 'undo', show: 'always', iconColor: 'white'
},{
  title: 'Save', iconName: 'save', show: 'always', iconColor: 'white'
}]

class TodoPage extends Component {

  static propTypes = {
    data: PropTypes.shape({
      type: PropTypes.oneOf(Object.keys(TypeIcon)).isRequired,
      status: PropTypes.oneOf(Object.keys(StatusText)).isRequired,
      priority: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      start_at: PropTypes.number,
      deadline: PropTypes.number,
      end_at: PropTypes.number,
      location: PropTypes.string,
      contents: PropTypes.arrayOf(PropTypes.shape({
        content: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired
      })).isRequired
    }).isRequired,
    loading: PropTypes.bool,
    onRequestUpdate: PropTypes.func,
    onChangeSaved: PropTypes.func
  }

  static defaultProps = {
    loading: false
  }

  temp = {
    title: '',
    priority: 5,
    location: '',
    start_at: null,
    deadline: null,
    contents: ["是TesttTesttestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是Testtestes车尺寸尺寸是TesttTesttestes车尺"]
  }

  constructor(props) {
    super(props)

    this.resetState(props)
  }

  resetState = (props = this.props) => {
    // 深复制, 防止直接修改contents
    const cloneData = JSON.parse(JSON.stringify(props.data))
    this.state = {
      modified: false,
      ...cloneData
    }

    const { start_at, deadline, end_at } = this.state
    const date = {
      start_at: start_at ? new Date(start_at * 1000) : null,
      deadline: deadline ? new Date(deadline * 1000) : null,
      end_at: end_at ? new Date(end_at * 1000) : null
    }
    return Object.assign(this.state, date)
  }

  /**
   * convert state data to request data
   */
  getDate = () => {

  }

  showTitleDialog = () => {
    this.temp.title = this.state.title
    this.dialog.show({
      title: 'Title',
      content: (
        <TextInput
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          autoFocus
          defaultValue={this.temp.title}
          maxLength={30}
          onChangeText={text => this.temp.title = text}
        />
      ),
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'OK',
        onPress: () => {
          if (this.state.title != this.temp.title) {
            this.setState({
              modified: true,
              title: this.temp.title
            })
          }
          this.onCloseDialog()
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
          selectedText={TypeText[this.state.type]}
          list={TypeDialogList}
          onSelected={this.onSelectType}
        />
      )
    })
  }

  showPriorityDialog = () => {
    this.temp.priority = this.state.priority
    this.dialog.show({
      title: 'Priority',
      noPadding: true,
      content: (
        <SliderWithIndicator
          style={{ margin: 10 }}
          maximumValue={9}
          minimumValue={1}
          step={1}
          value={this.temp.priority}
          onSlidingComplete={value => {
            this.temp.priority = value
          }}
        />
      ),
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'OK',
        onPress: () => {
          if (this.state.priority != this.temp.priority) {
            this.setState({
              modified: true,
              priority: this.temp.priority
            })
          }
          this.onCloseDialog()
        }
      }]
    })
  }

  showLocationDialog = () => {
    this.temp.location = this.state.location
    this.dialog.show({
      title: 'Location',
      content: (
        <TextInput
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          autoFocus
          defaultValue={this.temp.location}
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
          if (this.state.location != this.temp.location) {
            this.setState({
              modified: true,
              location: this.temp.location
            })
          }
          this.onCloseDialog()
        }
      }]
    })
  }

  showContentEditor = (text, index) => {
    this.props.navigator.push({
      ...router.textEditor,
      props: {
        title: 'Content',
        defaultValue: text,
        editComplete: (newText) => {
          if (text != newText) {
            const newContents = this.state.contents
            newContents[index].content = newText
            this.setState({
              modified: true,
              contents: newContents
            })
          }
        }
      }
    })
  }

  setStartAt = () => {
    if (this.state.start_at) {
      this.temp.start_at = new Date(this.state.start_at)
    } else {
      this.temp.start_at = new Date()
    }
    this.dialog.show({
      title: 'Start At',
      content: (
        <DatePicker
          defaultDate={this.temp.start_at}
          onChangeDate={date => {
            this.temp.start_at = date
          }}
        />
      ),
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'OK',
        onPress: () => {
          if (!this.state.start_at || this.state.start_at.getTime() != this.temp.start_at.getTime()) {
            this.setState({
              modified: true,
              start_at: this.temp.start_at
            })
          }

          this.onCloseDialog()
        }
      }]
    })
  }

  setDeadline = () => {
    if (this.state.deadline) {
      this.temp.deadline = new Date(this.state.deadline)
    } else {
      this.temp.deadline = new Date()
    }
    this.dialog.show({
      title: 'Deadline',
      content: (
        <DatePicker
          defaultDate={this.temp.deadline}
          onChangeDate={date => {
            this.temp.deadline = date
          }}
        />
      ),
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'OK',
        onPress: () => {
          if (!this.state.deadline || this.state.deadline.getTime() != this.temp.deadline.getTime()) {
            this.setState({
              modified: true,
              deadline: this.temp.deadline
            })
          }
          this.onCloseDialog()
        }
      }]
    })
  }

  showAddContentPage = () => {
    this.props.navigator.push({
      ...router.textEditor,
      props: {
        title: 'Add Content',
        defaultValue: '',
        editComplete: (text) => {
          const newContents = this.state.contents
          if (newContents.length < 10) {
            newContents.push({
              content: text,
              status: 0
            })

            this.setState({
              modified: true,
              contents: newContents
            })
          } else {
            ToastAndroid.show('Contents are no more than 10.', ToastAndroid.SHORT)
          }
        }
      }
    })
  }

  showContentMenu = (index) => {
    this.dialog.show({
      title: 'Content',
      noPadding: true,
      content: (
        <SelectableList
          list={[{ text: 'Delete' }]}
          onSelected={(i) => {
            this.showConfirmDialog('Delete', 'Are you sure?', () => {
              this.state.contents.splice(index, 1)
              this.setState({
                contents: this.state.contents
              })
            })
          }}
        />
      )
    })
  }

  showConfirmDialog = (title, description, cb) => {
    this.dialog.show({
      title: title,
      content: (
        <Text>
          {description}
        </Text>
      ),
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'OK',
        onPress: () => {
          cb && cb()
          this.onCloseDialog()
        }
      }]
    })
  }

  showLoadingDialog = (title) => {
    this.dialog.show({
      title: title,
      content: (
        <ProgressBarAndroid
          color={Colors.accent100}
        />
      )
    })
  }

  onComplete = () => {

  }

  onLaySide = () => {

  }

  onSelectType = (index, type) => {
    if (Types[index] != this.state.type) {
      this.setState({
        modified: true,
        type: Types[index]
      })
    }

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

  // onKeyboardHide = () => {
  //   dismissKeyboard()
  // }

  onActionSelected = index => {
    switch (index) {
      case 0:
        this.showConfirmDialog('Revert', 'This operation is not reversible', () => {
          const newState = this.resetState()
          this.setState({
            ...newState
          })
        })
        break
      case 1:
        const { onChangeSaved } = this.props
        this.showLoadingDialog('Saving...')
        onChangeSaved && onChangeSaved()
          .then()
        break
    }
  }

  onRefresh = () => {
    const { onRequestUpdate } = this.props
    onRequestUpdate && onRequestUpdate()
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setDrawerLockMode('locked-closed'))
    ToastAndroid.show('add hide listener', ToastAndroid.SHORT)
    // Keyboard.addEventListener('keyboardDidHide', this.onKeyboardHide)
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setDrawerLockMode('unlocked'))
    ToastAndroid.show('remove hide listener', ToastAndroid.SHORT)
    // Keyboard.removeEventListener('keyboardDidHide', this.onKeyboardHide)
  }

  renderActions() {
    return (
      <View style={styles.actions}>
        <Button
          text="Complete"
          type="raise"
          color={statusColors['complete']}
          style={styles.action}
          onPress={this.onComplete}
        />
        <Button
          text="Lay Side"
          type="raise"
          color={statusColors['layside']}
          style={styles.action}
          onPress={this.onLaySide}
        />
      </View>
    )
  }

  renderContent() {
    const { loading } = this.props
    const { title, type, status, priority, start_at, deadline, end_at, location, contents } = this.state

    return (
      <ScrollView
        style={styles.fillParent}
        onScroll={this.onScroll}
        refreshControl={
          <RefreshControl
            colors={[Colors.accent100, Colors.accent200, Colors.accent400]}
            refreshing={loading}
            onRefresh={this.onRefresh}
          />
        }
      >
        <Section
          text="Title"
          secondText={title}
          ref={r => this.title = r}
          onPress={this.showTitleDialog}
        />
        <Divider style={styles.divider} />
        <Section
          text="Type"
          secondText={TypeText[type]}
          iconName={TypeIcon[type]}
          onPress={this.showTypeDialog}
        />
        <Section
          text="Status"
          secondText={StatusText[status]}
        />
        <Section
          text="Priority"
          secondText={priority}
          onPress={this.showPriorityDialog}
        />
        <Divider style={styles.divider} />
        <Section
          text="Start at"
          secondText={start_at ? formatDate(start_at) : 'Not set'}
          iconName="access-time"
          onPress={this.setStartAt}
        />
        <Section
          text="Deadline"
          secondText={deadline ? formatDate(deadline) : 'Not set'}
          iconName="alarm"
          onPress={this.setDeadline}
        />
        {end_at &&
          <Section
            text="End at"
            secondText={formatDate(end_at)}
            iconName="alarm-on"
          />
        }
        {location && <Divider style={styles.divider} />}
        {location &&
          <Section
            text="Location"
            secondText={location}
            iconName="location-on"
            onPress={this.showLocationDialog}
          />
        }
        <Divider style={styles.divider} />
        <Subheader
          text="Contents"
          leftPadding={68}
        />
        {contents.map((item, index) =>
          <SingleLineSection
            key={index}
            text={item.content}
            leftElement={
              <Checkbox
                style={styles.leftEl}
                color={Colors.accent100}
                checked={item.status == 1}
              />
            }
            onPress={() => this.showContentEditor(item.content, index)}
            onLongPress={() => this.showContentMenu(index)}
          />
        )}
        {contents.length < 10 &&
          <SingleLineSection
            key={99}
            text="Add Content"
            iconName="add-circle-outline"
            onPress={this.showAddContentPage}
          />
        }
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
          actions={this.state.modified ? ModifiedActions : []}
          onActionSelected={this.onActionSelected}
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
  return ownProps
}

export default connect(select)(TodoPage)
