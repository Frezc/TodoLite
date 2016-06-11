/**
 * Created by Frezc on 2016/6/10.
 */
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

class TabBar extends Component {

  static propTypes = {
    menuItems: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      iconName: PropTypes.string.isRequired,
      color: PropTypes.string
    })),
    onItemPress: PropTypes.func               // (index, item)
  }

  static defaultProps = {
    menuItems: []
  }

  render() {
    const { menuItems, onItemPress } = this.props

    return (
      <View style={styles.root}>
        {menuItems.map((item, index) =>
          <TouchableOpacity
            key={index}
            activeOpacity={0.6}
            onPress={() => onItemPress && onItemPress(index, item)}
          >
            <View style={styles.item}>
              <Icon name={item.iconName} size={24} color={item.color} />
              <Text style={[styles.itemText, { color: item.color }]}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-around'
  },
  item: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 12
  },
  itemText: {
    fontSize: 12
  }
})

export default TabBar
