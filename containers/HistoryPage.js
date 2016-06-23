import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  RefreshControl,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { Colors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'
import TodoSection from '../components/TodoSection'
import router from '../helpers/router'
import NeedAuth from '../components/NeedAuth'
import { 
  showDialog, closeDialog, setStatusFilter, setTypeFilter, setSearchText,
  setYear, pageReady
} from '../actions/view'
import { fetchHistoryNetwork, fetchHistoryLocal } from '../actions/network'
import { StatusText, TypeText, yearPickerItems } from '../constants'
import ListFilterContainer from './ListFilterContainer'
import Picker from '../components/UncPicker'

const statusList = [{
  text: 'All'
}, {
  text: StatusText['complete']
}, {
  text: StatusText['abandon']
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

const actions = [{
  title: 'calendar', iconName: 'date-range', show: 'always', iconColor: 'white'
}]

class HistoryPage extends Component {

  static propTypes = {
    token: PropTypes.string,
    loading: PropTypes.bool,
    all: PropTypes.number,
    data: PropTypes.array,
    statusFilter: PropTypes.string,
    typeFilter: PropTypes.string,
    searchText: PropTypes.string,
    year: PropTypes.number.isRequired
  }

  static defaultProps = {
    loading: false,
    all: -1,
    data: [],
    statusFilter: '',
    typeFilter: '',
    searchText: ''
  }

  temp = {
    year: 0
  }
  
  constructor(props) {
    super(props)

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: this.rowHasChanged
      }).cloneWithRows(props.data),
    }
  }

  getParams = (props = this.props) => {
    const { statusFilter, typeFilter, searchText } = props
    const params = {}
    if (statusFilter) {
      statusFilter == 'complete' ? params['complete'] = 1 : params['complete'] = 0
      statusFilter == 'abandon' ? params['abandon'] = 1 : params['abandon'] = 0
    }
    if (typeFilter) {
      params['types'] = typeFilter
    }
    if (searchText) {
      params['keyword'] = searchText
    }
    return params
  }

  rowHasChanged = (r1, r2) => {
    return r1 !== r2
  }

  onRefresh = (props = this.props) => {
    const { dispatch, token, year } = props
    dispatch(fetchHistoryNetwork(token, year, this.getParams(props)))
  }

  onCloseDialog = () => {
    this.props.dispatch(closeDialog())
  }

  onSetSearchText = text => {
    const { dispatch } = this.props
    dispatch(setSearchText('historyPage', text))
  }

  onSelectStatus = (index, text) => {
    const { dispatch } = this.props
    switch (index) {
      case 0:
        // all
        dispatch(setStatusFilter('historyPage', ''))
        break
      case 1:
        // complete
        dispatch(setStatusFilter('historyPage', 'complete'))
        break
      case 2:
        // abandon
        dispatch(setStatusFilter('historyPage', 'abandon'))
        break
    }
    this.onCloseDialog()
  }
  
  onSelectType = (index, text) => {
    const { dispatch } = this.props
    if (index == 0) {
      dispatch(setTypeFilter('historyPage', ''))
    } else {
      dispatch(setTypeFilter('historyPage', types[index - 1]))
    }
    this.onCloseDialog()
  }

  onYearChanged = year => {
    const { dispatch } = this.props
    dispatch(setYear(year))
    ToastAndroid.show('See what you did at ' + year + ' !', ToastAndroid.SHORT)
  }

  onActionSelected = index => {
    const { dispatch, year } = this.props
    this.temp.year = year
    dispatch(showDialog({
      title: 'Select year',
      content: (
        <Picker
          defaultValue={year}
          mode="dropdown"
          items={yearPickerItems}
          onValueChange={value => this.temp.year = value}
        />
      ),
      onRequestClose: this.onCloseDialog,
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'OK',
        onPress: () => {
          if (this.temp.year != year) {
            this.onYearChanged(this.temp.year)
          }

          this.onCloseDialog()
        }
      }]
    }))
  }

  onEndReached = () => {
    const { dispatch, token, year, all, data } = this.props
    if (all > data.length) {
      const params = Object.assign(this.getParams(), {
        offset: data.length
      })
      dispatch(fetchHistoryNetwork(token, year, params))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data, statusFilter, searchText, typeFilter, year } = this.props
    if (data !== nextProps.data) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.data)
      })
    }

    // 在这几项更新后刷新页面
    if (statusFilter != nextProps.statusFilter || searchText != nextProps.searchText
      || typeFilter != nextProps.typeFilter || year != nextProps.year) {
      this.onRefresh(nextProps)
    }
  }

  componentDidMount() {
    const { all, token, ready, dispatch } = this.props
    if (!ready) {
      dispatch(fetchHistoryLocal())
      dispatch(pageReady('historyPage'))
    } else if (all < 0 && token) {
      this.onRefresh()
    }
  }

  renderSection = (todo, sectionID, rowID, highlightRow) => {
    return (
      <TodoSection
        data={todo}
        onPress={() => {
          this.props.navigator.push({
            ...router.todo,
            props: {
              data: todo,
              type: 'show'
            }
          })
        }}
      />
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

  renderFooter = () => {
    const { all, data } = this.props

    if (all > data.length) {
      return (
        <View
          style={styles.loadingMore}
        >
          <ActivityIndicator
            color={Colors.accent100}
            size="small"
          />
          <Text
            style={styles.loadingMoreText}
          >Loading more...</Text>
        </View>
      )
    }
  }

  render() {
    const { openDrawer, token, loading, navigator, year } = this.props

    // todo: 列表的无限加载
    return (
      <View style={{ flex: 1 }}>
        <Toolbar
          navIconName="menu"
          title={`History of ${year}`}
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
            onEndReachedThreshold={100}
            onEndReached={this.onEndReached}
            renderHeader={this.renderHeader}
            renderFooter={this.renderFooter}
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
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 42
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 12
  }
})

function select(state, ownProps) {
  return Object.assign({
    token: state.auth.token,
    ...ownProps
  }, state.view.historyPage)
}

export default connect(select)(HistoryPage)
