/**
 * Created by Frezc on 2016/6/25.
 */
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  RefreshControl,
  ToastAndroid,
  ScrollView,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import Toolbar from '../components/Toolbar'
import { Colors } from '../assets/Theme'
import LoadingButton from '../components/LoadingButton'
import isLength from 'validator/lib/isLength'
import { fetchR, constructBody, resolveErrorResponse } from '../helpers'
import { CHANGEPW_URL } from '../constants/urls'
import { logoutLocal } from '../actions/network'
import Page from './ToolbarPage'

class ChangePasswordPage extends Page {

  state = {
    oldPassword: '',
    newPassword: '',
    rNewPassword: '',
    loading: false
  }

  checkInput = () => {
    const { oldPassword, newPassword, rNewPassword } = this.props
    if (!isLength(this.state.newPassword, { min: 6, max: 32 })) {
      ToastAndroid.show('Length of Password should between 6 and 32.', ToastAndroid.SHORT)
      return false
    } else if (this.state.newPassword !== this.state.rNewPassword) {
      ToastAndroid.show('Confirm Password is different.', ToastAndroid.SHORT)
      return false
    }

    return true
  }

  onSure = () => {
    const { dispatch, token, navigator } = this.props
    
    if (this.checkInput()) {
      this.setState({
        loading: true
      })
      fetchR(CHANGEPW_URL, {
        method: 'post',
        body: constructBody({
          token,
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword
        })
      }).then(response => {
        if (response.ok) {
          ToastAndroid.show('Your password has been changed. Please re-auth.', ToastAndroid.LONG)
          dispatch(logoutLocal())
          navigator.popToTop()
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
  }
  
  getTitle() {
    return 'Change password'
  }

  shouldLockDrawer() {
    return false
  }

  renderContents() {
    const { oldPassword, newPassword, rNewPassword, loading } = this.state
    return (
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.pageContent}
        keyboardShouldPersistTaps
      >
        <TextInput
          style={styles.textInput}
          placeholder="Old password"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          // underlineColorAndroid={Colors.accent400}
          value={oldPassword}
          onChangeText={text => this.setState({ oldPassword: text })}
        />
        <TextInput

          style={styles.textInput}
          placeholder="New password"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          // underlineColorAndroid={Colors.accent400}
          value={newPassword}
          onChangeText={text => this.setState({ newPassword: text })}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Confirm new password"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          // underlineColorAndroid={Colors.accent400}
          value={rNewPassword}
          onChangeText={text => this.setState({ rNewPassword: text })}
        />
        <LoadingButton
          text="OK"
          loading={loading}
          style={styles.sureBtn}
          buttonTextStyle={{ color: Colors.accent400 }}
          onPress={this.onSure}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
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
  sureBtn: { marginTop: 32 }
})

function select(state, ownProps) {
  return {
    token: state.auth.token
  }
}

export default connect(select)(ChangePasswordPage)
