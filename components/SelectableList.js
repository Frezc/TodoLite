import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native';
import { Colors } from '../assets/Theme'
import Icon from 'react-native-vector-icons/MaterialIcons'

class SelectableList extends Component {

  static propTypes = {
    selectedIndex: PropTypes.number,
    selectedText: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.shape({
      iconName: PropTypes.string,
      text: PropTypes.string.isRequired
    })).isRequired,
    noRepeat: PropTypes.bool,      // if true, onSelected won't be called when select selected item.
    onSelected: PropTypes.func     // (index, text)
  }
  
  static defaultProps = {
    noRepeat: false
  }

  render() {
    const { style, selectedIndex, selectedText, list, onSelected, noRepeat } = this.props

    return (
      <View style={[styles.root, style]}>
        {list.map((item, index) => {
          let titleStyle = [styles.sectionText]
          const isSelected = selectedIndex == index || selectedText == item.text;
          if (isSelected) titleStyle.push(styles.active)
          return (
            <TouchableNativeFeedback
              key={index}
              background={TouchableNativeFeedback.SelectableBackground()}
              onPress={() => noRepeat && isSelected || onSelected(index, item.text)}
            >
              <View style={styles.section}>
                {item.iconName &&
                  <Icon name={item.iconName} size={20} color={isSelected ? Colors.accent100 : "gray"} style={styles.sectionIcon}/>
                }
                <Text style={titleStyle} numberOfLines={1}>{item.text}</Text>
              </View>
            </TouchableNativeFeedback>
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  section: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionIcon: {
    marginLeft: 16
  },
  sectionText: {
    marginLeft: 24
  },
  active: {
    color: Colors.accent100
  }
})

export default SelectableList
