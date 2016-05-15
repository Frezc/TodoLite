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

class TodoSection extends Component {
  
  static propTypes = {
    type: PropTypes.oneOf(Object.keys(TypeIcon)),
    status: PropTypes.oneOf([0, 1, 2, 3]),
    priority: PropTypes.number,
    onPress: PropTypes.func
  }

  static defaultProps = {
    type: 'default',
    status: 0,
    priority: 5
  }

  getIconColor = () => {
    const { status, priority } = this.props;

    if (status == 0) {
      return statusColors[0][priority]
    } else {
      return statusColors[status]
    }
  }
  
  render() {
    const { data, type, onPress } = this.props

    return (
      <TouchableNativeFeedback onPress={onPress}>
        <View style={styles.section}>
          <View style={styles.icon}>
            <Icon name={TypeIcon[type]} size={24} color={this.getIconColor()} />
          </View>
          <View style={styles.abstract}>
            <Text style={styles.title} numberOfLines={1}>
              {data}
            </Text>
            <Text style={styles.subTitle} numberOfLines={1}>
              Location: 23333333, Start At: 2016-1-25
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
