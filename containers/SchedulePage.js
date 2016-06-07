import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableNativeFeedback,
  ListView,
  RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import { generateRandomStringArray } from '../helpers'
import { Colors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'
import TodoSection from '../components/TodoSection'
import router from '../helpers/router'
import NeedAuth from '../components/NeedAuth'
import { fetchScheduleNetwork } from '../actions/network'

class SchedulePage extends Component {

  static propsTypes = {
    token: PropTypes.string,
    loading: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.object)
  }

  static defaultProps = {
    loading: false,
    data: []
  }

  data = generateRandomStringArray(100, '一点事情字数补丁字数补丁一点事情字数补丁字数补丁一点事情字数补丁字数补丁')

  constructor(props) {
    super(props)
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(props.data)
    }
  }

  onRefresh = () => {
    const { dispatch, token } = this.props

    dispatch(fetchScheduleNetwork(token))
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.data)
    })
  }

  renderSection = (rowData, sectionID, rowID, highlightRow) => {
    return (
      <TodoSection
        data={rowData}
        onPress={() => {
          this.props.navigator.push({
            ...router.todo,
            props: {
              data: rowData,
              onChangeSaved: data => {
              
              }
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
  
  render() {
    const { openDrawer, token, loading, navigator } = this.props

    return (
      // flex: 1 缺少ListView会无法滚动
      <View style={{ flex: 1 }}>
        <Toolbar
          navIconName="menu"
          title={'Schedule'}
          onIconClicked={openDrawer}
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
            renderHeader={() => <Text>Header</Text>}
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
    ...ownProps
  }
}

export default connect(select)(SchedulePage)
