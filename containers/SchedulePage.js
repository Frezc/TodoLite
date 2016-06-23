import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  ListView,
  RefreshControl,
  ToastAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { Colors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'
import TodoSection from '../components/TodoSection'
import router from '../helpers/router'
import NeedAuth from '../components/NeedAuth'
import { fetchScheduleNetwork, fetchSchedule } from '../actions/network'
import { 
  showDialog, closeDialog, setStatusFilter, setTypeFilter, setSearchText,
  pageReady
} from '../actions/view'
import { saveSchedule } from '../actions/data'
import { StatusText, TypeText } from '../constants'
import ListFilterContainer from './ListFilterContainer'
import AppWidgets from '../libs/AppWidgets'

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
    typeFilter: PropTypes.string,
    searchText: PropTypes.string
  }

  static defaultProps = {
    loading: false,
    data: [],
    statusFilter: '',
    typeFilter: '',
    searchText: ''
  }

  /* 在这里面是无法调用下面的变量的
  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: this.rowHasChanged
    }).cloneWithRows(this.generateData(this.props)),
    searchText: ''
  }
  */

  constructor(props) {
    super(props)

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: this.rowHasChanged
      }).cloneWithRows(this.generateData(props)),
    }
  }

  generateData = (props = this.props) => {
    const { data, todos, statusFilter, typeFilter, searchText } = props
    const sortedData = data.filter(todoId => {
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

  onRefresh = () => {
    const { dispatch, token } = this.props

    dispatch(fetchScheduleNetwork(token))
  }

  onActionSelected = index => {
    this.onAddTodo()
  }

  onAddTodo = () => {
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

  onSetSearchText = text => {
    const { dispatch } = this.props
    dispatch(setSearchText('schedulePage', text))
    dispatch(saveSchedule())
  }

  onSelectStatus = (index, text) => {
    const { dispatch } = this.props
    switch (index) {
      case 0:
        // all
        dispatch(setStatusFilter('schedulePage', ''))
        dispatch(saveSchedule())
        break
      case 1:
        // to do
        dispatch(setStatusFilter('schedulePage', 'todo'))
        dispatch(saveSchedule())
        break
      case 2:
        // lay side
        dispatch(setStatusFilter('schedulePage', 'layside'))
        dispatch(saveSchedule())
        break
    }
    this.onCloseDialog()
  }

  onSelectType = (index, text) => {
    const { dispatch } = this.props
    if (index == 0) {
      dispatch(setTypeFilter('schedulePage', ''))
      dispatch(saveSchedule())
    } else {
      dispatch(setTypeFilter('schedulePage', types[index - 1]))
      dispatch(saveSchedule())
    }

    this.onCloseDialog()
  }

  onSectionPress = (todoId) => {
    this.props.navigator.push({
      ...router.todo,
      props: {
        todoId,
        type: 'edit'
      }
    })
  }

  appWidgetClick = event => {
    if (event.action == AppWidgets.APPWIDGET_CLICK) {
      ToastAndroid.show(`You press todo id: ${event.payload.id} action: ${event.action}`, ToastAndroid.LONG)
      this.onSectionPress(event.payload.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.generateData(nextProps))
    })
  }

  componentDidMount() {
    const { ready, dispatch, token } = this.props
    if (!ready) {
      // todo: 首屏只渲染列表的部分项
      dispatch(fetchSchedule(token))
        .then(() => {
          AppWidgets.addListener(AppWidgets.APPWIDGET_CLICK, this.appWidgetClick)
          // todo: test
          AppWidgets.addListener(AppWidgets.APPWIDGET_EMPTY_CLICK, this.onAddTodo)
        })
      dispatch(pageReady('schedulePage'))
    } else {
      AppWidgets.addListener(AppWidgets.APPWIDGET_CLICK, this.appWidgetClick)
      AppWidgets.addListener(AppWidgets.APPWIDGET_EMPTY_CLICK, this.onAddTodo)
    }
  }

  componentWillUnmount() {
    AppWidgets.removeListener(AppWidgets.APPWIDGET_CLICK, this.appWidgetClick)
    AppWidgets.removeListener(AppWidgets.APPWIDGET_EMPTY_CLICK, this.onAddTodo)
  }

  renderSection = (todo, sectionID, rowID, highlightRow) => {
    return (
      <TodoSection
        data={todo}
        onPress={() => this.onSectionPress(todo.id)}
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
    const { statusFilter, typeFilter, searchText, dispatch } = this.props
    
    return (
      <ListFilterContainer
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        searchText={searchText}
        statusList={statusList}
        dispatch={dispatch}
        onSelectStatus={this.onSelectStatus}
        onSelectType={this.onSelectType}
        onSetSearchText={this.onSetSearchText}
      />
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

function select(state, ownProps) {
  return Object.assign({
    token: state.auth.token,
    todos: state.todos,
    ...ownProps
  }, state.view.schedulePage)
}

export default connect(select)(SchedulePage)
