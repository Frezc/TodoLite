import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableNativeFeedback
} from 'react-native'
import { Colors } from '../assets/Theme'
import Icon from 'react-native-vector-icons/MaterialIcons'

class SingleLineSection extends Component {

  static propTypes = {
    // when leftElement is undefined
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    leftElement: PropTypes.element,
    text: PropTypes.any.isRequired,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func
  }

  static defaultProps = {
    iconColor: Colors.accent100
  }

  renderLeftItem() {
    const { leftElement, iconName, iconColor } = this.props

    if (leftElement) {
      return leftElement
    } else if (iconName) {
      return <Icon name={iconName} size={20} color={iconColor} style={styles.icon} />
    } else {
      return <View style={styles.icon} />
    }
  }

  render() {
    const { text, onPress, onLongPress } = this.props

    return (
      <TouchableNativeFeedback onPress={onPress} onLongPress={onLongPress}>
        <View style={styles.section}>
          {this.renderLeftItem()}
          <View style={styles.singleLineItems}>
            <Text style={styles.text} numberOfLines={1}>{text}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40
  },
  icon: {
    marginLeft: 16,
    marginRight: 16,
    width: 20
  },
  singleLineItems: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'stretch'
  },
  text: {
    fontSize: 13,
    color: 'black',
    opacity: 0.54
  }
})

export default SingleLineSection
