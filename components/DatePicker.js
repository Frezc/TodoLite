import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  DatePickerAndroid,
  TimePickerAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

class DatePicker extends Component {

  static propTypes = {
    dateTime: PropTypes.number
  }

  static defaultProps = {
    dateTime: Date.now()
  }

  selectDate = () => {
    DatePickerAndroid.open({
      date: new Date()
    }).then(({ action, year, month, day }) => {
      if (action !== DatePickerAndroid.dismissedAction) {
        console.log(year)
      }
    }).catch(({ code, message }) => {

    })
  }

  selectTime = () => {
    const now = new Date()
    TimePickerAndroid.open({
      hour: now.getHours(),
      minute: now.getMinutes()
    }).then(({ action, hour, minute }) => {
      if (action !== DatePickerAndroid.dismissedAction) {
        console.log(hour)
      }
    }).catch(({ code, message }) => {

    })
  }

  render() {

    return (
        <View style={styles.root}>
          <TouchableWithoutFeedback onPress={this.selectDate}>

            <View style={[styles.selectableCell, styles.date]}>
              <Text>2016 - 06 - 14</Text>
              <Icon name="arrow-drop-down" size={16} style={styles.alignRigth} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.selectTime}>

            <View style={[styles.selectableCell, styles.time]}>
              <Text>8:00 PM</Text>
              <Icon name="arrow-drop-down" size={16} style={styles.alignRigth} />
            </View>
          </TouchableWithoutFeedback>
        </View>

    )
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  selectableCell: {
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
    flexDirection: 'row',
    alignItems: 'center'
  },
  alignRigth: {
    position: 'absolute',
    right: 0,
    top: 8
  },
  date: {
    flex: 1.6,
    marginRight: 8
  },
  time: {
    flex: 1
  }
})

export default DatePicker
