import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableNativeFeedback,
  ListView,
  RefreshControl,
  ToastAndroid,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import { generateRandomStringArray, fetchR, resolveErrorResponse } from '../helpers'
import { Colors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'
import TodoSection from '../components/TodoSection'
import router from '../helpers/router'
import NeedAuth from '../components/NeedAuth'
import { fetchScheduleNetwork } from '../actions/network'
import { showDialog, closeDialog, setStatusFilter, setTypeFilter } from '../actions/view'
import ListFilter from '../components/ListFilter'
import SelectableList from '../components/SelectableList'
import { StatusText, TypeText } from '../constants'

const actions = [{
  title: 'Add Todo', iconName: 'add', show: 'always', iconColor: 'white'
}]

const statusList = [{
  text: 'All'
}, {
  text: StatusText['todo']
}, {
  text: StatusText['layside']
}]

const typeList = [{
  text: 'All'
}]
const types = Object.keys(TypeText)
for (const type of types) {
  typeList.push({
    text: TypeText[type]
  })
}

class SchedulePage extends Component {

  static propsTypes = {
    token: PropTypes.string,
    loading: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.number),
    todos: PropTypes.object.isRequired,
    statusFilter: PropTypes.string,
    typeFilter: PropTypes.string
  }

  static defaultProps = {
    loading: false,
    data: [],
    statusFilter: '',
    typeFilter: ''
  }

  /* 在这里面是无法调用下面的变量的
  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: this.rowHasChanged
    }).cloneWithRows(this.generateData(this.props)),
    searchText: ''
  }
  */

  temp = {
    searchText: ''
  }

  constructor(props) {
    super(props)

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: this.rowHasChanged
      }).cloneWithRows(this.generateData(props)),
      searchText: ''  //todo
    }
  }

  generateData = (props = this.props) => {
    const { data, todos } = props
    const { searchText } = this.state || {}
    const { statusFilter, typeFilter } = props
    const sortedData = data.slice().filter(todoId => {
      if (statusFilter && todos[todoId].status != statusFilter) {
        return false
      }
      if (typeFilter && todos[todoId].type != typeFilter) {
        return false
      }
      if (searchText && todos[todoId].title.search(searchText) == -1) {
        return false
      }
      return true
    }).sort((a, b) => {
      const ta = todos[a]
      const tb = todos[b]
      if (ta.priority != tb.priority) {
        return tb.priority - ta.priority
      } else {
        if (ta.updated_at < tb.updated_at) {
          return 1
        } else if (ta.updated_at > tb.updated_at) {
          return -1
        } else {
          return 0
        }
      }
    })
    return sortedData.map(todoId => {
      return todos[todoId]
    })
  }

  rowHasChanged = (r1, r2) => {
    return r1 !== r2
  }

  showSearchTextDialog = () => {
    this.temp.searchText = this.state.searchText
    this.props.dispatch(showDialog({
      title: 'Search..',
      content: (
        <TextInput
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          autoFocus
          defaultValue={this.temp.searchText}
          maxLength={30}
          onChangeText={text => this.temp.searchText = text}
        />
      ),
      onRequestClose: this.onCloseDialog,
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'CLEAR',
        onPress: () => {
          if (this.state.searchText) {
            this.setState({
              searchText: ''
            })
          }
          this.onCloseDialog()
        }
      }, {
        text: 'OK',
        onPress: () => {
          if (this.state.searchText != this.temp.searchText) {
            this.setState({
              searchText: this.temp.searchText
            })
          }
          this.onCloseDialog()
        }
      }]
    }))
  }

  showStatusDialog = () => {
    const { statusFilter } = this.props
    this.props.dispatch(showDialog({
      title: 'Status',
      noPadding: true,
      content: (
        <SelectableList
          selectedText={StatusText[statusFilter] || 'All'}
          list={statusList}
          onSelected={this.onSelectStatus}
        />
      ),
      onRequestClose: this.onCloseDialog
    }))
  }

  showTypeDialog = () => {
    const { typeFilter } = this.props
    this.props.dispatch(showDialog({
      title: 'Type',
      noPadding: true,
      content: (
        <SelectableList
          selectedText={TypeText[typeFilter] || 'All'}
          list={typeList}
          onSelected={this.onSelectType}
        />
      ),
      onRequestClose: this.onCloseDialog
    }))
  }

  onRefresh = () => {
    const { dispatch, token } = this.props

    dispatch(fetchScheduleNetwork(token))
  }

  onActionSelected = index => {
    this.props.navigator.push({
      ...router.todo,
      props: {
        type: 'create'
      }
    })
  }

  onCloseDialog = () => {
    this.props.dispatch(closeDialog())
  }

  onSelectStatus = (index, text) => {
    const { dispatch } = this.props
    switch (index) {
      case 0:
        // all
        dispatch(setStatusFilter('schedulePage', ''))
        break
      case 1:
        // to do
        dispatch(setStatusFilter('schedulePage', 'todo'))
        break
      case 2:
        // lay side
        dispatch(setStatusFilter('schedulePage', 'layside'))
        break
    }
    this.onCloseDialog()
  }

  onSelectType = (index, text) => {
    const { dispatch } = this.props
    if (index == 0) {
      dispatch(setTypeFilter('schedulePage', ''))
    } else {
      dispatch(setTypeFilter('schedulePage', types[index - 1]))
    }

    this.onCloseDialog()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.generateData(nextProps))
    })
  }

  renderSection = (todo, sectionID, rowID, highlightRow) => {
    const { token, dispatch } = this.props
    return (
      <TodoSection
        data={todo}
        onPress={() => {
          this.props.navigator.push({
            ...router.todo,
            props: {
              todoId: todo.id,
              type: 'edit'
            }
          })
        }}
      />
    )
  }

  // need not now
  renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
    return (
      // 添加了key属性, 消除一个警告
      <View style={{ backgroundColor: 'darkgray', height: 1, marginLeft: 70, opacity: 0.34 }} key={rowID} />
    )
  }

  renderHeader = () => {
    const { searchText } = this.state
    const { statusFilter, typeFilter } = this.props

    return (
      <ListFilter>
        <ListFilter.SearchFilter
          text={searchText || 'Search'}
          onPress={this.showSearchTextDialog}
        />
        <ListFilter.PickerGroup
          filters={[{
            text: StatusText[statusFilter] || 'All',
            onPress: this.showStatusDialog
          }, {
            text: TypeText[typeFilter] || 'All',
            onPress: this.showTypeDialog
          }]}
        />
      </ListFilter>
    )
  }
  
  render() {
    const { openDrawer, token, loading, navigator } = this.props

    return (
      // flex: 1 缺少ListView会无法滚动
      <View style={{ flex: 1 }}>
        <Toolbar
          navIconName="menu"
          title={'Schedule'}
          onIconClicked={openDrawer}
          actions={actions}
          onActionSelected={this.onActionSelected}
        />
        {token ?
          <ListView
            style={{ backgroundColor: 'white' }}
            dataSource={this.state.dataSource}
            enableEmptySections
            refreshControl={
              <RefreshControl
                colors={[Colors.accent100, Colors.accent200, Colors.accent400]}
                refreshing={loading}
                onRefresh={this.onRefresh}
              />
            }
            renderHeader={this.renderHeader}
            renderRow={this.renderSection}
          />
          :
          <NeedAuth
            navigator={navigator}
          />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({

})

function select(state, ownProps) {
  return Object.assign({
    token: state.auth.token,
    todos: state.todos,
    ...ownProps
  }, state.view.schedulePage)
}

export default connect(select)(SchedulePage)
