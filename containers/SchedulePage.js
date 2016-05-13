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
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'

class SchedulePage extends Component {

  data = generateRandomStringArray(100)

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
      <TouchableNativeFeedback>
        <View style={styles.section}>
          {
            //<View style={styles.statusLabel} />
          }
          <View style={styles.icon}>
            <Icon name="android-time" size={40} />
          </View>
          <View style={styles.abstract}>
            <Text style={styles.title}>
              {rowData}
            </Text>
          </View>
          <View style={styles.rightIcon}>
            <Icon name="chevron-right" size={16} />
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
    return (
      // 添加了key属性, 消除一个警告
      <View style={{ backgroundColor: 'darkgray', height: 1, marginLeft: 68 }} key={rowID} />
    )
  }
  
  render() {
    const { openDrawer } = this.props

    return (
      // flex: 1 缺少ListView会无法滚动
      <View style={{ flex: 1 }}>
        <Toolbar
          navIconName="android-menu"
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
          renderFooter={() => <Text>Footer</Text>}
          renderSeparator={this.renderSeparator}
          renderRow={rowData => this.renderSection(rowData)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  section: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  statusLabel: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: 16,
    borderTopColor: 'green',
    borderRightWidth: 16,
    borderRightColor: 'transparent'
  },
  icon: {
    flex: 0.2,
    paddingLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'gray'
  },
  abstract: {
    flex: 0.8,
    paddingLeft: 8,
    alignSelf: 'stretch',
    // backgroundColor: 'gray'
  },
  title: {
    fontWeight: '600',
    fontSize: 16
  },
  rightIcon: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center'
    // backgroundColor: 'orange'
  }
})

export default SchedulePage
