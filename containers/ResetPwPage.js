/**
 * Created by Frezc on 2016/6/27.
 */
import React from 'react'
import {
  StyleSheet, ScrollView, TextInput,
  ToastAndroid, View
} from 'react-native'
import { connect } from 'react-redux'
import Page from './ToolbarPage'
import { Colors } from '../assets/Theme'
import Button from '../components/Button'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'
import { SENDEMAIL_URL, RESETPW_URL } from '../constants/urls'
import { easyFetch, resolveErrorResponse, fetchR, constructBody } from '../helpers'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import LoadingButton from '../components/LoadingButton'
import { logoutLocal } from '../actions/network'

class ResetPwPage extends Page {


  state = {
    email: '',
    password: '',
    passwordR: '',
    code: '',
    countDown: 0,
    getCodeDisable: false,
    loading: false
  }

  sendEmail = () => {
    if (isEmail(this.state.email)) {

      this.setState({
        getCodeDisable: true
      })

      // console.log(`${SENDEMAIL_URL}?email=${this.state.email}`);
      easyFetch(SENDEMAIL_URL, {
        email: this.state.email
      }).then(response => {
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
      }).catch(err => {
        ToastAndroid.show(err.message, ToastAndroid.SHORT)
        this.setState({
          getCodeDisable: false
        })
      })
    } else {
      ToastAndroid.show('Email is invalid.', ToastAndroid.SHORT)
    }
  }

  validate = () => {
    if (!isEmail(this.state.email)) {
      ToastAndroid.show('Invalid email address.', ToastAndroid.SHORT)
      return false
    } else if (!isLength(this.state.password, { min: 6, max: 32 })) {
      ToastAndroid.show('Length of Password should between 6 and 32.', ToastAndroid.SHORT)
      return false
    } else if (this.state.password !== this.state.passwordR) {
      ToastAndroid.show('Confirm Password is different.', ToastAndroid.SHORT)
      return false
    } else if (!isLength(this.state.code, { min: 1 })) {
      ToastAndroid.show('Code can\'t be empty.', ToastAndroid.SHORT)
      return false
    }

    return true
  }

  onSure = () => {
    if (!this.validate()) return

    const { dispatch, navigator } = this.props
    const { email, password, code } = this.state

    this.setState({
      loading: true
    })

    fetchR(RESETPW_URL, {
      method: 'post',
      body: constructBody({
        email,
        password,
        code
      })
    }).then(response => {
      if (response.ok) {
        ToastAndroid.show('Your password has been reset. You can login with your new password.', ToastAndroid.LONG)
        dispatch(logoutLocal())
        navigator.pop()
      } else {
        resolveErrorResponse(response)
      }
    }).catch(err => {
      ToastAndroid.show(err.message, ToastAndroid.SHORT)
    }).then(() => {
      this.setState({
        loading: false
      })
    })
  }
  
  getTitle() {
    return 'Reset password'
  }

  shouldLockDrawer() {
    return false
  }
  
  renderContents() {
    
    return (
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.pageContent}
        keyboardShouldPersistTaps
      >
        <TextInput
          placeholder="EMAIL"
          style={styles.section}
          selectionColor={Colors.accent100}
          keyboardType="email-address"
          value={this.state.email}
          onChangeText={text => this.setState({ email: text })}
        />
        <TextInput
          style={styles.section}
          placeholder="PASSWORD"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          value={this.state.password}
          onChangeText={text => this.setState({ password: text })}
        />
        <TextInput
          style={styles.section}
          placeholder="PASSWORD REPEAT"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          value={this.state.passwordR}
          onChangeText={text => this.setState({ passwordR: text })}
        />
        <View
          style={[styles.section, styles.getCodeLine]}
        >
          <TextInput
            style={styles.fillParent}
            placeholder="CODE"
            selectionColor={Colors.accent100}
            value={this.state.code}
            onChangeText={text => this.setState({ code: text })}
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
          loading={this.state.loading}
          style={styles.sureBtn}
          buttonTextStyle={{ color: Colors.accent400 }}
          onPress={this.onSure}
        />
      </ScrollView>
    )
  }
}

reactMixin(ResetPwPage.prototype, TimerMixin)

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
  section: {
    alignSelf: 'stretch',
    marginBottom: 8
  },
  getCodeLine: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  getCodeButton: {
    width: 80
  },
  sureBtn: { marginTop: 32 }
})

function select(state, ownProps) {
  return {}
}

export default connect(select)(ResetPwPage)
