/**
 * Created by Frezc on 2016/6/14.
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  ToastAndroid,
  TextInput
} from 'react-native';
import ListFilter from '../components/ListFilter'
import { StatusText, TypeText } from '../constants'
import { showDialog, closeDialog } from '../actions/view'
import { Colors } from '../assets/Theme'
import SelectableList from '../components/SelectableList'

const statusList = [{
  text: 'All'
}, {
  text: StatusText['todo']
}, {
  text: StatusText['layside']
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

class ListFilterContainer extends Component {

  static propTypes = {
    statusFilter: PropTypes.string,
    typeFilter: PropTypes.string,
    searchText: PropTypes.string,
    statusList: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string
    })),
    typeList: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string
    })),
    dispatch: PropTypes.func.isRequired,
    onSelectStatus: PropTypes.func,
    onSelectType: PropTypes.func,
    onSetSearchText: PropTypes.func
  }

  static defaultProps = {
    statusFilter: '',
    typeFilter: '',
    searchText: '',
    statusList: statusList,
    typeList: typeList
  }

  temp = {
    searchText: ''
  }

  showSearchTextDialog = () => {
    const { searchText, dispatch, onSetSearchText } = this.props
    this.temp.searchText = searchText
    dispatch(showDialog({
      title: 'Search..',
      content: (
        <TextInput
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
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
          searchText && onSetSearchText && onSetSearchText('')
          this.onCloseDialog()
        }
      }, {
        text: 'OK',
        onPress: () => {
          searchText != this.temp.searchText && onSetSearchText &&
            onSetSearchText(this.temp.searchText)
          this.onCloseDialog()
        }
      }]
    }))
  }

  showStatusDialog = () => {
    const { statusFilter, onSelectStatus, dispatch, statusList } = this.props
    dispatch(showDialog({
      title: 'Status',
      noPadding: true,
      content: (
        <SelectableList
          selectedText={StatusText[statusFilter] || 'All'}
          list={statusList}
          noRepeat
          onSelected={onSelectStatus}
        />
      ),
      onRequestClose: this.onCloseDialog
    }))
  }

  showTypeDialog = () => {
    const { typeFilter, onSelectType, dispatch, typeList } = this.props
    dispatch(showDialog({
      title: 'Type',
      noPadding: true,
      content: (
        <SelectableList
          selectedText={TypeText[typeFilter] || 'All'}
          list={typeList}
          noRepeat
          onSelected={onSelectType}
        />
      ),
      onRequestClose: this.onCloseDialog
    }))
  }

  onCloseDialog = () => {
    this.props.dispatch(closeDialog())
  }
  
  render() {
    const { statusFilter, typeFilter, searchText } = this.props

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
}

export default ListFilterContainer
