import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableNativeFeedback,
  ListView,
  RefreshControl,
  ToastAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { generateRandomStringArray, fetchR, resolveErrorResponse } from '../helpers'
import { Colors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'
import TodoSection from '../components/TodoSection'
import router from '../helpers/router'
import NeedAuth from '../components/NeedAuth'
import { fetchScheduleNetwork } from '../actions/network'
import { TODO_URL } from '../constants/urls'
import ListFilter from '../components/ListFilter'

const actions = [{
  title: 'Add Todo', iconName: 'add', show: 'always', iconColor: 'white'
}]

class SchedulePage extends Component {

  static propsTypes = {
    token: PropTypes.string,
    loading: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.number),
    todos: PropTypes.object.isRequired
  }

  static defaultProps = {
    loading: false,
    data: []
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: this.rowHasChanged
      }).cloneWithRows(this.generateData(props))
    }
  }

  generateData = (props = this.props) => {
    const { data, todos } = props
    return data.map(todoId => {
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
    this.props.navigator.push({
      ...router.todo,
      props: {
        type: 'create'
      }
    })
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
    return (
      <ListFilter>
        <ListFilter.SearchFilter
          text="Search"
        />
        <ListFilter.PickerGroup
          filters={[{
            text: 'All'
          }, {
            text: 'Desc by Updated at'
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
  return {
    token: state.auth.token,
    loading: state.view.schedulePage.loading,
    data: state.view.schedulePage.data,
    todos: state.todos,
    ...ownProps
  }
}

export default connect(select)(SchedulePage)
