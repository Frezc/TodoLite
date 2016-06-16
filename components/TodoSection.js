import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableNativeFeedback,
  ListView,
  RefreshControl
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TypeIcon } from '../constants'
import { statusColors } from '../assets/Theme'
import { formatDate } from '../helpers'

class TodoSection extends Component {
  
  static propTypes = {
    data: PropTypes.shape({
      type: PropTypes.oneOf(Object.keys(TypeIcon)).isRequired,
      status: PropTypes.oneOf(['todo', 'complete', 'layside', 'abandon']).isRequired,
      priority: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      start_at: PropTypes.number,
      deadline: PropTypes.number,
      location: PropTypes.string,
      created_at: PropTypes.string
    }).isRequired,
    onPress: PropTypes.func
  }

  getIconColor = () => {
    const { status, priority } = this.props.data

    if (status == 'todo') {
      return statusColors['todo'][priority]
    } else {
      return statusColors[status]
    }
  }

  getSecondText = () => {
    const { start_at, location, deadline, created_at } = this.props.data
    let text = []
    location && text.push(`Location: ${location}`)
    deadline != 0 && text.push(`Deadline: ${formatDate(new Date(deadline * 1000))}`)
    start_at != 0 && text.length < 2 && text.push(`Start at: ${formatDate(new Date(start_at * 1000))}`)
    if (text.length == 0) {
      text.push(`Created at: ${created_at}`)
    }
    return text.join(', ')
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data !== nextProps.data
  }
  
  render() {
    const { data, onPress } = this.props
    const { type, title } = data

    return (
      <TouchableNativeFeedback onPress={onPress}>
        <View style={styles.section}>
          <View style={styles.icon}>
            <Icon name={TypeIcon[type]} size={24} color={this.getIconColor()} />
          </View>
          <View style={styles.abstract}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.subTitle} numberOfLines={1}>
              {this.getSecondText()}
            </Text>
          </View>
          <View style={styles.rightIcon}>
            <Icon name="chevron-right" size={24} />
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

const styles = StyleSheet.create({
  section: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  icon: {
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.87
    // backgroundColor: 'gray'
  },
  abstract: {
    flex: 1,
    paddingLeft: 4,
    alignSelf: 'center',
    // backgroundColor: 'gray'
  },
  title: {
    fontSize: 13,
  },
  subTitle: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.78
  },
  rightIcon: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'flex-start'
    // backgroundColor: 'orange'
  }
})

export default TodoSection
