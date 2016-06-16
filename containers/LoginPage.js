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
import Toolbar from '../components/Toolbar'
import { setDrawerLockMode } from '../actions/view'
import { authSuccess, fetchScheduleNetwork, fetchHistoryNetwork } from '../actions/network'
import { AUTH_URL, SENDEMAIL_URL, REGISTER_URL } from '../constants/urls'
import { APPIDENTITY } from '../constants'
import { fetchR, resolveErrorResponse } from '../helpers'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import dismissKeyboard from 'dismissKeyboard'

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
      ToastAndroid.show('Length of PW should between 6 and 32.', ToastAndroid.SHORT)
      return false
    } else if (this.state.rePw !== this.state.rePwr) {
      ToastAndroid.show('Twice PW is different.', ToastAndroid.SHORT)
      return false
    } else if (!isLength(this.state.reName, { min: 1, max: 32 })) {
      ToastAndroid.show('Length of PW should between 1 and 32', ToastAndroid.SHORT)
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
  
  onBackPress = () => {
    const { navigator } = this.props
    
    navigator.pop()
  }

  onLogin = () => {
    const { dispatch, navigator } = this.props

    dismissKeyboard()

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
          ToastAndroid.show(json.token, ToastAndroid.SHORT);
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
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  sendEmail = () => {
    if (isEmail(this.state.reEmail)) {
      
      this.setState({
        getCodeDisable: true
      })

      console.log(`${SENDEMAIL_URL}?email=${this.state.reEmail}`);
      fetchR(`${SENDEMAIL_URL}?email=${this.state.reEmail}`)
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
          ToastAndroid.show(err, ToastAndroid.SHORT)
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
        ToastAndroid.show(err, ToastAndroid.SHORT)
        this.setState({
          registering: false
        })
      })
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
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.pageContent}
        keyboardShouldPersistTaps
      >
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
            disabled={this.state.getCodeDisable}
            onPress={this.sendEmail}
          />
        </View>
        <LoadingButton
          text="OK"
          style={{ marginTop: 32 }}
          buttonTextStyle={{ color: Colors.accent400 }}
          onPress={this.onRegister}
        />
      </ScrollView>
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
          <View style={styles.pageContainer}>
            {this.renderLoginPage()}
          </View>
          <View style={styles.pageContainer}>
            {this.renderRegisterPage()}
          </View>
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
  pageContainer: {
    flex: 1
  },
  page: {
    flex: 1,
    padding: 16,
    paddingTop: 36
    // backgroundColor: 'orange'
  },
  pageContent: {
    alignItems: 'center',
  }
})

function select(state, ownProps) {
  return ownProps;
}

export default connect(select)(LoginPage)
