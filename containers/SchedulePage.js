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
import { generateRandomStringArray } from '../helpers'
import { Colors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'
import TodoSection from '../components/TodoSection'
import router from '../helpers/router'

class SchedulePage extends Component {

  data = generateRandomStringArray(100, '一点事情字数补丁字数补丁一点事情字数补丁字数补丁一点事情字数补丁字数补丁')

  state = {
    refreshing: false,
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.data)
  }

  onRefresh = () => {
    this.setState({
      refreshing: true
    })
    console.log('onrefresh')
  }

  renderSection = (rowData, sectionID, rowID, highlightRow) => {

    return (
      <TodoSection
        type="work"
        data={rowData}
        onPress={() => {
          this.props.navigator.push(router.todo)
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
    const { openDrawer } = this.props

    return (
      // flex: 1 缺少ListView会无法滚动
      <View style={{ flex: 1 }}>
        <Toolbar
          navIconName="menu"
          title={'Schedule'}
          onIconClicked={openDrawer}
        />
        <ListView
          style={{ backgroundColor: 'white' }}
          dataSource={this.state.dataSource}
          refreshControl={
            <RefreshControl
              colors={[Colors.accent100, Colors.accent200, Colors.accent400]}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          renderHeader={() => <Text>Header</Text>}
          renderRow={rowData => this.renderSection(rowData)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({

})

export default SchedulePage
