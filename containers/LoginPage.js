import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  TextInput,
  ToastAndroid
} from 'react-native';
import { connect } from 'react-redux';
import ViewPagerIndicator from '../components/ViewPagerIndicator'
import LoadingButton from '../components/LoadingButton'
import Button from '../components/Button'
import { Colors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'
import { setDrawerLockMode } from '../actions/view'
import { authSuccess } from '../actions/network'
import { AUTH_URL } from '../constants/urls'
import { fetchR } from '../helpers'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

class LoginPage extends Component {

  state = {
    pageOffset: 0,

    email: '',
    password: '',
    logining: false,

    reEmail: '',
    rePw: '',
    rePwr: '',
    reName: '',
    reCode: '',
    countDown: 0,
    registering: false
  }

  onPageScroll = e => {
    const { position, offset } = e.nativeEvent
    // this.setState({
    //   pageOffset: position + offset
    // })
    this.indicator && this.indicator.setOffset(position + offset)
  }

  onIndicatorPress = (index, title) => {
    this.viewPager.setPage(index);
  }
  
  onBackPress = () => {
    const { navigator } = this.props
    
    navigator.pop()
  }

  onLogin = () => {
    const { dispatch, navigator } = this.props

    this.setState({
      logining: true
    })

    const data = new FormData()
    data.append('email', this.state.email)
    data.append('password', this.state.password)

    return fetchR(AUTH_URL, {
      method: 'post',
      body: data
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          ToastAndroid.show(json.token, ToastAndroid.SHORT);
          dispatch(authSuccess(json))

          navigator.pop()
        })
      } else {
        response.json().then(json => {
          console.log(json)
          ToastAndroid.show('Wrong Email or Password!', ToastAndroid.SHORT);
        })
      }

      // this.setState({
      //   logining: false
      // })
    }).catch(error => {
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  sendEmail = () => {
    if (isEmail(this.state.reEmail)) {
      
      this.setState({
        countDown: 60
      })

      this.timer = this.setInterval(() => {
        this.setState({
          countDown: this.state.countDown - 1
        })
        if (this.state.countDown <= 0) this.clearInterval(this.timer)
      }, 100)
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setDrawerLockMode('locked-closed'))
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setDrawerLockMode('unlocked'))
  }

  renderLoginPage() {

    return (
      <View style={styles.page}>
        <TextInput
          placeholder="EMAIL"
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          keyboardType="email-address"
          value={this.state.email}
          onChangeText={text => this.setState({ email: text })}
          onBlur={() => console.log('on blur')}
        />
        <TextInput
          style={{ marginTop: 8 }}
          placeholder="PASSWORD"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          value={this.state.password}
          onChangeText={text => this.setState({ password: text })}
        />
        <LoadingButton
          text="OK"
          loading={this.state.logining}
          style={{ marginTop: 32 }}
          buttonTextStyle={{ color: Colors.accent400 }}
          onPress={this.onLogin}
        />
      </View>
    )
  }

  renderRegisterPage() {

    return (
      <View style={styles.page}>
        <TextInput
          placeholder="EMAIL"
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          keyboardType="email-address"
          value={this.state.reEmail}
          onChangeText={text => this.setState({ reEmail: text })}
        />
        <TextInput
          style={{ marginTop: 8 }}
          placeholder="PASSWORD"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          value={this.state.rePw}
          onChangeText={text => this.setState({ rePw: text })}
        />
        <TextInput
          style={{ marginTop: 8 }}
          placeholder="PASSWORD REPEAT"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          value={this.state.rePwr}
          onChangeText={text => this.setState({ rePwr: text })}
        />
        <TextInput
          style={{ marginTop: 8 }}
          placeholder="NICKNAME"
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          value={this.state.reName}
          onChangeText={text => this.setState({ reName: text })}
        />
        <View
          style={{ flexDirection: 'row', marginTop: 8, alignSelf: 'stretch', alignItems: 'center' }}
        >
          <TextInput
            style={{ flex: 1 }}
            placeholder="CODE"
            selectionColor={Colors.accent100}
            underlineColorAndroid={Colors.accent400}
            value={this.state.reCode}
            onChangeText={text => this.setState({ reCode: text })}
          />
          <Button
            text={this.state.countDown || "GET CODE"}
            style={{ width: 80 }}
            disabled={this.state.countDown != 0}
            onPress={this.sendEmail}
          />
        </View>
        <LoadingButton
          text="OK"
          style={{ marginTop: 32 }}
          buttonTextStyle={{ color: Colors.accent400 }}
        />
      </View>
    )
  }
  
  render() {
    
    return (
      <View style={{ flex: 1 }}>
        <Toolbar
          navIconName="arrow-back"
          title={'Todo Lite'}
          onIconClicked={this.onBackPress}
        />
        <ViewPagerIndicator
          titles={['LOGIN', 'REGISTER']}
          onPress={this.onIndicatorPress}
          ref={ref => this.indicator = ref}
        />
        <ViewPagerAndroid
          style={styles.pages}
          keyboardDismissMode="on-drag"
          onPageScroll={this.onPageScroll}
          ref={r => this.viewPager = r}
        >
          {this.renderLoginPage()}
          {this.renderRegisterPage()}
        </ViewPagerAndroid>
      </View>
    );
  }
}

reactMixin(LoginPage.prototype, TimerMixin)

const styles = StyleSheet.create({
  pages: {
    flex: 1
  },
  page: {
    flex: 1,
    top: 200,
    alignItems: 'center',
    padding: 16,
    paddingTop: 36
    // backgroundColor: 'orange'
  }
})

function select(state, ownProps) {
  return ownProps;
}

export default connect(select)(LoginPage)
