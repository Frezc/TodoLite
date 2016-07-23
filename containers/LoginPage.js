import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  TextInput,
  ToastAndroid,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import ViewPagerIndicator from '../components/ViewPagerIndicator'
import LoadingButton from '../components/LoadingButton'
import Button from '../components/Button'
import { Colors } from '../assets/Theme'
import { authSuccess, fetchScheduleNetwork } from '../actions/network'
import { AUTH_URL, SENDEMAIL_URL, REGISTER_URL } from '../constants/urls'
import { APPIDENTITY } from '../constants'
import { fetchR, resolveErrorResponse, easyFetch } from '../helpers'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import dismissKeyboard from 'dismissKeyboard'
import router from '../helpers/router'
import Page from './ToolbarPage'

class LoginPage extends Page {

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
    getCodeDisable: false,
    registering: false
  }

  /**
   * @return boolean
   */
  validateRe = () => {
    if (!isEmail(this.state.reEmail)) {
      ToastAndroid.show('Invalid email address.', ToastAndroid.SHORT)
      return false
    } else if (!isLength(this.state.rePw, { min: 6, max: 32 })) {
      ToastAndroid.show('Length of Password should between 6 and 32.', ToastAndroid.SHORT)
      return false
    } else if (this.state.rePw !== this.state.rePwr) {
      ToastAndroid.show('Confirm Password is different.', ToastAndroid.SHORT)
      return false
    } else if (!isLength(this.state.reName, { min: 1, max: 32 })) {
      ToastAndroid.show('Length of name should between 1 and 32', ToastAndroid.SHORT)
      return false
    } else if (!isLength(this.state.reCode, { min: 1 })) {
      ToastAndroid.show('Code can\'t be empty.', ToastAndroid.SHORT)
      return false
    }

    return true
  }

  clearRegisterInfo = () => {
    this.setState({
      reEmail: '',
      rePw: '',
      rePwr: '',
      reName: '',
      reCode: ''
    })
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

  onLogin = () => {
    const { dispatch, navigator } = this.props

    dismissKeyboard()

    if (!this.state.email || !this.state.password) {
      ToastAndroid.show('You cannot leave email or password empty.', ToastAndroid.SHORT)
      return
    }

    this.setState({
      logining: true
    })

    const data = new FormData()
    data.append('app', APPIDENTITY)
    data.append('email', this.state.email)
    data.append('password', this.state.password)

    return fetchR(AUTH_URL, {
      method: 'post',
      body: data
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          // ToastAndroid.show(json.token, ToastAndroid.SHORT);
          dispatch(authSuccess(json))
          
          // 登陆成功后获取数据
          dispatch(fetchScheduleNetwork(json.token))
          navigator.pop()
        })
      } else {
        response.json().then(json => {
          console.log(json)
          ToastAndroid.show('Wrong Email or Password!', ToastAndroid.SHORT);
        })
      }

      this.setState({
        logining: false
      })
    }).catch(error => {
      this.setState({
        logining: false
      })
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    })
  }

  sendEmail = () => {
    if (isEmail(this.state.reEmail)) {
      
      this.setState({
        getCodeDisable: true
      })

      console.log(`${SENDEMAIL_URL}?email=${this.state.reEmail}`);
      easyFetch(SENDEMAIL_URL, {
        email: this.state.reEmail
      })
      // fetchR(`${SENDEMAIL_URL}?email=${this.state.reEmail}`)
        .then(response => {
          if (response.ok) {
            ToastAndroid.show('Email sent successfully', ToastAndroid.SHORT)
          } else {
            resolveErrorResponse(response)
          }

          this.setState({
            countDown: 60
          })

          this.timer = this.setInterval(() => {
            this.setState({
              countDown: this.state.countDown - 1
            })
            if (this.state.countDown <= 0) {
              this.clearInterval(this.timer)
              this.setState({
                getCodeDisable: false
              })
            }
          }, 1000)
        })
        .catch(err => {
          ToastAndroid.show(err.message, ToastAndroid.SHORT)
          this.setState({
            getCodeDisable: false
          })
        })
    } else {
      ToastAndroid.show('Email is invalid.', ToastAndroid.SHORT)
    }
  }

  onRegister = () => {
    if (this.validateRe()) {
      this.setState({
        registering: true
      })

      const { reEmail, rePw, reName, reCode } = this.state
      const params = new FormData()
      params.append('email', reEmail)
      params.append('password', rePw)
      params.append('nickname', reName)
      params.append('code', reCode)

      fetchR(REGISTER_URL, {
        method: 'POST',
        body: params
      }).then(response => {
        if (response.ok) {
          this.setState({
            email: this.state.reEmail
          })
          this.clearRegisterInfo()
          this.viewPager.setPage(0)

          ToastAndroid.show('Register succeed. You can login now.', ToastAndroid.SHORT)
        } else {
          resolveErrorResponse(response)
        }

        this.setState({
          registering: false
        })
      }).catch(err => {
        ToastAndroid.show(err.message, ToastAndroid.SHORT)
        this.setState({
          registering: false
        })
      })
    }
  }

  toResetPw = () => {
    this.props.navigator.push(router.resetPw)
  }

  getTitle() {
    return 'Todo Lite'
  }

  renderLoginPage() {

    return (
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.pageContent}
        keyboardShouldPersistTaps
      >
        <TextInput
          placeholder="EMAIL"
          style={styles.textInput}
          selectionColor={Colors.accent100}
          // underlineColorAndroid={Colors.accent400}
          keyboardType="email-address"
          value={this.state.email}
          onChangeText={text => this.setState({ email: text })}
          onBlur={() => console.log('on blur')}
        />
        <TextInput
          style={styles.textInput}
          placeholder="PASSWORD"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          // underlineColorAndroid={Colors.accent400}
          value={this.state.password}
          onChangeText={text => this.setState({ password: text })}
        />
        <Button
          text="Forgot password ?"
          style={styles.fpBtn}
          onPress={this.toResetPw}
        />
        <LoadingButton
          text="OK"
          loading={this.state.logining}
          style={styles.sureBtn}
          buttonTextStyle={{ color: Colors.accent400 }}
          onPress={this.onLogin}
        />
      </ScrollView>
    )
  }

  renderRegisterPage() {

    return (
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.pageContent}
        keyboardShouldPersistTaps
      >
        <TextInput
          placeholder="EMAIL"
          style={styles.textInput}
          keyboardType="email-address"
          selectTextOnFocus
          selectionColor={Colors.accent100}
          value={this.state.reEmail}
          onChangeText={text => this.setState({ reEmail: text })}
        />
        <TextInput
          style={styles.textInput}
          placeholder="PASSWORD"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          // underlineColorAndroid={Colors.accent400}
          value={this.state.rePw}
          onChangeText={text => this.setState({ rePw: text })}
        />
        <TextInput
          style={styles.textInput}
          placeholder="PASSWORD REPEAT"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          // underlineColorAndroid={Colors.accent400}
          value={this.state.rePwr}
          onChangeText={text => this.setState({ rePwr: text })}
        />
        <TextInput
          style={styles.textInput}
          placeholder="NICKNAME"
          selectionColor={Colors.accent100}
          // underlineColorAndroid={Colors.accent400}
          value={this.state.reName}
          onChangeText={text => this.setState({ reName: text })}
        />
        <View
          style={styles.getCodeLine}
        >
          <TextInput
            style={styles.fillParent}
            placeholder="CODE"
            selectionColor={Colors.accent100}
            // underlineColorAndroid={Colors.accent400}
            value={this.state.reCode}
            onChangeText={text => this.setState({ reCode: text })}
          />
          <Button
            text={this.state.countDown || "GET CODE"}
            style={styles.getCodeButton}
            disabled={this.state.getCodeDisable}
            onPress={this.sendEmail}
          />
        </View>
        <LoadingButton
          text="OK"
          style={styles.sureBtn}
          buttonTextStyle={{ color: Colors.accent400 }}
          onPress={this.onRegister}
        />
      </ScrollView>
    )
  }

  renderContents() {
    return (
      <View style={styles.fillParent}>
        <ViewPagerIndicator
          titles={['LOGIN', 'REGISTER']}
          onPress={this.onIndicatorPress}
          ref={ref => this.indicator = ref}
        />
        <ViewPagerAndroid
          style={styles.fillParent}
          keyboardDismissMode="on-drag"
          onPageScroll={this.onPageScroll}
          ref={r => this.viewPager = r}
        >
          <View style={styles.fillParent}>
            {this.renderLoginPage()}
          </View>
          <View style={styles.fillParent}>
            {this.renderRegisterPage()}
          </View>
        </ViewPagerAndroid>
      </View>
    )
  }
}

reactMixin(LoginPage.prototype, TimerMixin)

const styles = StyleSheet.create({
  fillParent: {
    flex: 1
  },
  page: {
    flex: 1,
    padding: 16,
    paddingTop: 36
    // backgroundColor: 'orange'
  },
  pageContent: {
    alignItems: 'center'
  },
  textInput: {
    alignSelf: 'stretch',
    marginBottom: 8
  },
  getCodeLine: {
    flexDirection: 'row',
    marginTop: 8,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  getCodeButton: {
    width: 80
  },
  sureBtn: { marginTop: 32 },
  fpBtn: {
    width: 130,
    alignSelf: 'flex-start'
  }
})

function select(state, ownProps) {
  return ownProps;
}

export default connect(select)(LoginPage)
