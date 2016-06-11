/**
 * Created by Frezc on 2016/6/11.
 */
import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

class ListFilter extends Component {
  
  render() {
    const { children } = this.props
    return (
      <View>
        {children}
      </View>
    )
  }
}

class PickerGroup extends Component {
  static propTypes = {
    // only support one or two item
    filters: PropTypes.arrayOf(PropTypes.shape({
      onPress: PropTypes.func,
      text: PropTypes.string.isRequired
    })).isRequired
  }

  render() {
    const { filters } = this.props

    const sf = filters.slice(0, 2)

    return (
      <View style={styles.line}>
        {sf.map((f, index) =>
          <TouchableOpacity
            key={index}
            activeOpacity={0.6}
            style={styles.fill}
            onPress={f.onPress}
          >
            <View
              style={styles.cell}
            >
              <Text>{f.text}</Text>
              <Icon name="arrow-drop-down" size={20} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

class SearchFilter extends Component {

  static propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string
  }

  render() {
    const { onPress, text } = this.props

    return (
      <View style={styles.line}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.fill}
          onPress={onPress}
        >
          <View
            style={styles.searchCell}
          >
            <Icon name="search" size={20} />
            <Text style={styles.searchText}>{text}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

ListFilter.PickerGroup = PickerGroup
ListFilter.SearchFilter = SearchFilter

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    height: 36
  },
  fill: {
    flex: 1
  },
  cell: {
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: 'space-between'
  },
  searchCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchText: {
    marginLeft: 8
  }
})

export default ListFilter
