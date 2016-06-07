import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  DatePickerAndroid,
  TimePickerAndroid,
  ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

class DatePicker extends Component {

  static propTypes = {
    defaultDate: PropTypes.object.isRequired,
    onChangeDate: PropTypes.func
  }

  state = {
    // 生成新的Date对象
    date: this.props.defaultDate
  }

  selectDate = () => {
    const { onChangeDate } = this.props
    const { date } = this.state
    DatePickerAndroid.open({
      date: date
    }).then(({ action, year, month, day }) => {
      if (action !== DatePickerAndroid.dismissedAction) {
        date.setFullYear(year)
        date.setMonth(month)
        date.setDate(day)
        this.setState({
          date: date
        })
        onChangeDate && onChangeDate(date)
      }
    }).catch(({ code, message }) => {

    })
  }

  selectTime = () => {
    const { onChangeDate } = this.props
    const { date } = this.state
    TimePickerAndroid.open({
      hour: date.getHours(),
      minute: date.getMinutes()
    }).then(({ action, hour, minute }) => {
      if (action !== DatePickerAndroid.dismissedAction) {
        date.setHours(hour)
        date.setMinutes(minute)
        this.setState({
          date
        })
        onChangeDate && onChangeDate(date)
      }
    }).catch(({ code, message }) => {

    })
  }

  render() {
    const { date } = this.state
    console.log(this.state);
    // ToastAndroid.show(''+date.getHours(), ToastAndroid.LONG)
    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)
    const hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
    const minute = `0${date.getMinutes()}`.slice(-2)
    const ampm = date.getHours() > 12 ? 'pm' : 'am'
    
    return (
        <View style={styles.root}>
          <TouchableWithoutFeedback onPress={this.selectDate}>

            <View style={[styles.selectableCell, styles.date]}>
              <Text>{year} - {month} - {day}</Text>
              <Icon name="arrow-drop-down" size={16} style={styles.alignRigth} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.selectTime}>

            <View style={[styles.selectableCell, styles.time]}>
              <Text>{hour}:{minute} {ampm}</Text>
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
