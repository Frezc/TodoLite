import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableNativeFeedback
} from 'react-native'
import { Colors } from '../assets/Theme'
import Icon from 'react-native-vector-icons/MaterialIcons'

class MultiLinesSection extends Component {

  static propTypes = {
    // when leftElement is undefined
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    leftElement: PropTypes.element,
    text: PropTypes.any.isRequired,
    secondText: PropTypes.any.isRequired,
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
    const { text, secondText, onPress, onLongPress } = this.props

    return (
      <TouchableNativeFeedback
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <View style={styles.section}>
          {this.renderLeftItem()}
          <View style={styles.twoLineItems}>
            <Text style={styles.text}>{text}</Text>
            <Text style={styles.secondText} >{secondText}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'row'
  },
  icon: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
    marginBottom: 20,
    width: 20
  },
  twoLineItems: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 11,
    paddingBottom: 11,
    alignItems: 'stretch'
  },
  text: {
    fontSize: 13,
    color: 'black',
    opacity: 0.87
  },
  secondText: {
    fontSize: 13,
    color: 'black',
    opacity: 0.54
  }
})

export default MultiLinesSection
