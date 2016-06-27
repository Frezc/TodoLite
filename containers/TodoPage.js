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
  RefreshControl
} from 'react-native';
import { Colors, statusColors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'
import Subheader from '../components/Subheader'
import Divider from '../components/Divider'
import Section from '../components/MultiLinesSection'
import SingleLineSection from '../components/SingleLineSection'
import Checkbox from '../components/Checkbox'
import { TypeIcon, StatusText, TypeText, StatusIcon } from '../constants'
import { TODO_URL } from '../constants/urls'
import SelectableList from '../components/SelectableList'
import SliderWithIndicator from '../components/SliderWithIndicator'
import DatePicker from '../components/DatePicker'
import { setDrawerLockMode, refreshTodo, addTodo, showDialog,
  showLoadingDialog, showConfirmDialog, closeDialog } from '../actions/view'
import { completeTodo, abandonTodo, laysideTodo, recoverTodo } from '../actions/network'
import { connect } from 'react-redux';
import router from '../helpers/router'
import { formatDate, fetchR, resolveErrorResponse, easyFetch } from '../helpers'
import TabBar from '../components/TabBar'

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

const CreateActions = [{
  title: 'Done', iconName: 'done', show: 'always', iconColor: 'white'
}]

class TodoPage extends Component {

  static propTypes = {
    type: PropTypes.oneOf(['create', 'edit', 'show']).isRequired,
    /**
     * if type is 'show' and data is specified, this page will show data of this and cannot editable.
     * this prop is prepare for history.
     */
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
    }),
    /**
     * type: 'edit'
     * todoId and todos are prepare for editable todos.
     */
    todoId: PropTypes.number,
    todos: PropTypes.object.isRequired,
    // onRequestUpdate: PropTypes.func,              // (callback)
    // onChangeSave: PropTypes.func                 // (callback)
  }

  static defaultProps = {
    title: '',
    loading: false
  }

  temp = {
    title: '',
    priority: 5,
    location: '',
    start_at: null,
    deadline: null
  }

  constructor(props) {
    super(props)

    this.state = this.resetStateType()
  }

  resetStateTypeAndUpdate = () => {
    const newState = this.resetStateType()
    this.setState({
      ...newState
    })
  }

  resetStateType = () => {
    const { type, data, todoId, todos } = this.props

    switch (type) {
      case 'edit':
        return this.resetState(todos[todoId])
      case 'show':
        return this.resetState(data)
      case 'create':
        return this.resetState({
          title: 'Set your title',
          type: 'default',
          status: 'todo',
          priority: 5,
          location: '',
          contents: []
        })
    }
  }

  resetState = (data) => {
    // 深复制, 防止直接修改contents
    const cloneData = JSON.parse(JSON.stringify(data))
    this.state = {
      modified: false,
      loading: false,
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
  getData = () => {
    const { title, type, start_at, deadline, priority, location, contents } = this.state
    return {
      title,
      type,
      start_at: start_at ? start_at.getTime() / 1000 : 0,
      deadline: deadline ? deadline.getTime() / 1000 : 0,
      priority,
      location,
      contents: JSON.stringify(contents)
    }
  }

  generateFormData = () => {
    const { token } = this.props

    const rd = this.getData()
    const formData = new FormData()
    // value不能为null
    for(const key of Object.keys(rd)) {
      formData.append(key, rd[key])
    }
    formData.append('token', token)
    return formData
  }

  getTitle = () => {
    const { type } = this.props
    switch (type) {
      case 'create':
        return 'Create new todo'
      case 'edit':
        return 'Edit todo'
      case 'show':
        return 'Todo detail'
    }
  }

  showTitleDialog = () => {
    const { dispatch } = this.props
    this.temp.title = this.state.title
    dispatch(showDialog({
      title: 'Title',
      content: (
        <TextInput
          selectionColor={Colors.accent100}
          // underlineColorAndroid={Colors.accent400}
          autoFocus
          defaultValue={this.temp.title}
          maxLength={30}
          onChangeText={text => this.temp.title = text}
        />
      ),
      onRequestClose: this.onCloseDialog,
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
    }))
  }

  showTypeDialog = () => {
    this.props.dispatch(showDialog({
      title: 'Type',
      noPadding: true,
      content: (
        <SelectableList
          selectedText={TypeText[this.state.type]}
          list={TypeDialogList}
          onSelected={this.onSelectType}
        />
      ),
      onRequestClose: this.onCloseDialog
    }))
  }

  showPriorityDialog = () => {
    // bug
    this.temp.priority = this.state.priority
    this.props.dispatch(showDialog({
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
            console.log('onSlidingComplete', typeof value);
            this.temp.priority = value
          }}
        />
      ),
      onRequestClose: this.onCloseDialog,
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
    }))
  }

  showLocationDialog = () => {
    this.temp.location = this.state.location
    this.props.dispatch(showDialog({
      title: 'Location',
      content: (
        <TextInput
          selectionColor={Colors.accent100}
          // underlineColorAndroid={Colors.accent400}
          autoFocus
          defaultValue={this.temp.location}
          maxLength={255}
          onChangeText={text => this.temp.location = text}
        />
      ),
      onRequestClose: this.onCloseDialog,
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
    }))
  }

  showContentEditor = (text, index) => {
    this.props.navigator.push({
      ...router.textEditor,
      props: {
        title: 'Content',
        defaultValue: text,
        editable: this.props.type !== 'show',
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
    this.props.dispatch(showDialog({
      title: 'Start At',
      content: (
        <DatePicker
          defaultDate={this.temp.start_at}
          onChangeDate={date => {
            this.temp.start_at = date
          }}
        />
      ),
      onRequestClose: this.onCloseDialog,
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
    }))
  }

  setDeadline = () => {
    if (this.state.deadline) {
      this.temp.deadline = new Date(this.state.deadline)
    } else {
      this.temp.deadline = new Date()
    }
    this.props.dispatch(showDialog({
      title: 'Deadline',
      content: (
        <DatePicker
          defaultDate={this.temp.deadline}
          onChangeDate={date => {
            this.temp.deadline = date
          }}
        />
      ),
      onRequestClose: this.onCloseDialog,
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
    }))
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
    if (this.props.type === 'show') return;
    const { dispatch } = this.props
    dispatch(showDialog({
      title: 'Content',
      noPadding: true,
      onRequestClose: this.onCloseDialog,
      content: (
        <SelectableList
          list={[{ text: 'Delete', iconName: 'delete' }]}
          onSelected={(i) => {
            dispatch(showConfirmDialog('Delete', 'Are you sure?', (result) => {
              if (result === 'OK') {
                this.state.contents.splice(index, 1)
                this.setState({
                  contents: this.state.contents
                })
              }
              this.onCloseDialog()
            }))
          }}
        />
      )
    }))
  }

  showDateMenu = (dateState) => {
    const { dispatch } = this.props
    dispatch(showDialog({
      title: 'Date menu',
      noPadding: true,
      onRequestClose: this.onCloseDialog,
      content: (
        <SelectableList
          list={[{ text: 'Delete', iconName: 'delete' }]}
          onSelected={(i) => {
            dispatch(showConfirmDialog('Delete', 'Are you sure?', (result) => {
              if (result === 'OK') {
                this.setState({
                  modified: true,
                  [dateState]: null
                })
              }
              this.onCloseDialog()
            }))
          }}
        />
      )
    }))
  }

  onComplete = () => {
    const { dispatch, todoId, token, navigator } = this.props
    dispatch(showConfirmDialog('Complete', 
      'This operation cannot be reversed. (Your unsaved change will be lost.)', result => {
      if (result === 'OK') {
        dispatch(showLoadingDialog('Saving...'))
        dispatch(completeTodo(todoId, token))
          .then(() => {
            this.onCloseDialog()
            navigator.pop()
          }).catch(() => {
            this.onCloseDialog()
          })
      } else {
        this.onCloseDialog()
      }
    }))
  }
  
  onAbandon = () => {
    const { dispatch, todoId, token, navigator } = this.props
    dispatch(showConfirmDialog('Abandon',
      'This operation cannot be reversed. (Your unsaved change will be lost.)', result => {
        if (result === 'OK') {
          dispatch(showLoadingDialog('Saving...'))
          dispatch(abandonTodo(todoId, token))
            .then(() => {
              this.onCloseDialog()
              navigator.pop()
            }).catch(() => {
              this.onCloseDialog()
            })
        } else {
          this.onCloseDialog()
        }
      }))
  }

  onLaySide = (status) => {
    const { dispatch, todoId, token } = this.props
    dispatch(showConfirmDialog(StatusText[status],
      'This operation cannot be reversed. (Your unsaved change will be lost.)', result => {
        if (result === 'OK') {
          dispatch(showLoadingDialog('Saving...'))
          let future
          switch (status) {
            case 'todo':
              future = dispatch(recoverTodo(todoId, token))
              break
            case 'layside':
              future = dispatch(laysideTodo(todoId, token))
              break
          }
          future && future.then(() => {
            this.onCloseDialog()
            this.resetStateTypeAndUpdate()
          }).catch(() => {
            console.log('error');
            this.onCloseDialog()
          })
        } else {
          this.onCloseDialog()
        }
      }))
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
    this.props.dispatch(closeDialog())
  }

  onBackPress = () => {
    const { navigator, dispatch, type } = this.props

    if (this.state.modified) {
      dispatch(showConfirmDialog('Exit', 'Your unsaved data will be lost.', result => {
        if (result === 'OK') {
          navigator.pop()
        }
        this.onCloseDialog()
      }))
    } else {
      navigator.pop()
    }
  }

  onSave = () => {
    const { todoId, dispatch } = this.props
    dispatch(showLoadingDialog('Saving...'))

    // ToastAndroid.show(JSON.stringify(formData), ToastAndroid.LONG)
    const formData = this.generateFormData()
    console.log('form data', formData);
    fetchR(`${TODO_URL}/${todoId}`, {
      method: 'POST',
      body: formData
    }).then(response => {
      console.log(response);
      // ToastAndroid.show(JSON.stringify(response), ToastAndroid.LONG)
      if (response.ok) {
        response.json().then(json => {
          // ToastAndroid.show(JSON.stringify(json), ToastAndroid.LONG)
          console.log('response', json);
          dispatch(refreshTodo(json))
          this.resetStateTypeAndUpdate()
          ToastAndroid.show('Saved successfully', ToastAndroid.SHORT)
        })
      } else {
        resolveErrorResponse(response)
      }

      this.onCloseDialog()
    }).catch(err => {
      console.log(err);
      ToastAndroid.show(err.message, ToastAndroid.LONG)
      this.onCloseDialog()
    })
  }

  onCreate = () => {
    const { dispatch, navigator } = this.props

    dispatch(showLoadingDialog('Creating'))
    const formData = this.generateFormData()
    fetchR(`${TODO_URL}`, {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          dispatch(addTodo(json))
          ToastAndroid.show('Created successfully', ToastAndroid.SHORT)
          this.onCloseDialog()
          navigator.pop()
        })
      } else {
        resolveErrorResponse(response)
        this.onCloseDialog()
      }
    }).catch(err => {
      console.log(err);
      ToastAndroid.show(err.message, ToastAndroid.LONG)
      this.onCloseDialog()
    })
  }

  // onKeyboardHide = () => {
  //   dismissKeyboard()
  // }

  onActionSelected = index => {
    const { type, dispatch } = this.props
    switch (type) {
      case 'create':
        this.onCreate()
        break

      case 'edit':
        switch (index) {
          case 0:
            dispatch(showConfirmDialog('Revert', 'This operation is not reversible', (result) => {
              switch (result) {
                case 'OK':
                  this.resetStateTypeAndUpdate()
                  break
              }
              this.onCloseDialog()
            }))
            break
          case 1:
            this.onSave()
            break
        }
        break
    }

  }

  onRefreshSure = () => {
    const { todoId, token, dispatch } = this.props

    easyFetch(`${TODO_URL}/${todoId}`, {
      token: token
    })
    // fetchR(`${TODO_URL}/${todoId}?token=${token}`)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            dispatch(refreshTodo(json))
            this.resetStateTypeAndUpdate()
          })
        } else {
          resolveErrorResponse(response)
        }

      }).catch(err => {
        ToastAndroid.show('Check your connection.', ToastAndroid.SHORT)
      })
  }

  onRefresh = () => {
    const { dialog } = this.props
    if (this.state.modified) {
      dialog.showConfirm('Refresh', 'Your change will be lost.', this.onRefreshSure)
    } else {
      this.onRefreshSure()
    }
  }

  onContentCheckPress = (index, checked = true) => {
    const contents = this.state.contents
    contents[index].status = checked ? 1 : 0
    this.setState({
      modified: true,
      contents
    })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setDrawerLockMode('locked-closed'))
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setDrawerLockMode('unlocked'))
  }

  renderRefreshControl = () => {
    const { type } = this.props
    const { loading } = this.state
    if (type == 'edit') {
      return (
        <RefreshControl
          colors={[Colors.accent100, Colors.accent200, Colors.accent400]}
          refreshing={loading}
          onRefresh={this.onRefresh}
        />
      )
    }

    return null
  }

  renderToolbarActions = () => {
    const { type } = this.props
    const { modified } = this.state
    switch (type) {
      case 'create':
        return modified ? CreateActions : []
      case 'edit':
        return modified ? ModifiedActions : []
    }

    return []
  }

  renderActions() {
    const { status } = this.state
    const menuStatus = ['complete', 'abandon']
    if (status == 'todo') {
      menuStatus.push('layside')
    } else if (status == 'layside') {
      menuStatus.push('todo')
    }

    return (
      <TabBar
        menuItems={menuStatus.map(status => {
          return {
            title: StatusText[status],
            iconName: StatusIcon[status],
            color: status === 'todo' ? statusColors[status][5] : statusColors[status]
          }
        })}
        onItemPress={(index) => {
          switch (index) {
            case 0:
              return this.onComplete()
            case 1:
              return this.onAbandon()
            case 2:
              return this.onLaySide(menuStatus[2])
          }
        }}
      />
    )
  }

  renderContent() {
    const { title, type, status, priority, start_at, deadline, end_at, location, contents } = this.state
    const pType = this.props.type

    return (
      <ScrollView
        style={styles.fillParent}
        refreshControl={this.renderRefreshControl()}
      >
        <Section
          text="Title"
          secondText={title}
          ref={r => this.title = r}
          onPress={this.showTitleDialog}
          disabled={pType === 'show'}
        />
        <Divider style={styles.divider} />
        <Section
          text="Type"
          secondText={TypeText[type]}
          iconName={TypeIcon[type]}
          onPress={this.showTypeDialog}
          disabled={pType === 'show'}
        />
        <Section
          text="Status"
          secondText={StatusText[status]}
        />
        <Section
          text="Priority"
          secondText={priority}
          onPress={this.showPriorityDialog}
          disabled={pType === 'show'}
        />
        <Divider style={styles.divider} />
        <Section
          text="Start at"
          secondText={start_at ? formatDate(start_at) : 'Not set'}
          iconName="access-time"
          onPress={this.setStartAt}
          onLongPress={() => this.showDateMenu('start_at')}
          disabled={pType === 'show'}
        />
        <Section
          text="Deadline"
          secondText={deadline ? formatDate(deadline) : 'Not set'}
          iconName="alarm"
          onPress={this.setDeadline}
          onLongPress={() => this.showDateMenu('deadline')}
          disabled={pType === 'show'}
        />
        {end_at &&
          <Section
            text="End at"
            secondText={formatDate(end_at)}
            iconName="alarm-on"
          />
        }
        <Divider style={styles.divider} />
        <Section
          text="Location"
          secondText={location || 'Not set'}
          iconName="location-on"
          onPress={this.showLocationDialog}
          disabled={pType === 'show'}
        />
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
                onPress={() => this.onContentCheckPress(index, item.status != 1)}
                disabled={pType === 'show'}
              />
            }
            onPress={() => this.showContentEditor(item.content, index)}
            onLongPress={() => this.showContentMenu(index)}
          />
        )}
        {contents.length < 10 && pType !== 'show' &&
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
    const { type } = this.props

    return (
      <View style={styles.fillParent}>
        <Toolbar
          navIconName="arrow-back"
          title={this.getTitle()}
          onIconClicked={this.onBackPress}
          actions={this.renderToolbarActions()}
          onActionSelected={this.onActionSelected}
        />
        {this.renderContent()}
        {type == 'edit' && this.renderActions()}
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
    todos: state.todos,
    token: state.auth.token,
    ...ownProps
  }
}

export default connect(select)(TodoPage)
