import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import ViewPagerIndicator from '../components/ViewPagerIndicator'
import LoadingButton from '../components/LoadingButton'
import Button from '../components/Button'
import { Colors } from '../assets/Theme'
import Toolbar from '../components/Toolbar'

class LoginPage extends Component {

  state = {
    pageOffset: 0
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

  renderLoginPage() {

    return (
      <View style={styles.page}>
        <TextInput
          placeholder="EMAIL"
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          keyboardType="email-address"
        />
        <TextInput
          style={{ marginTop: 8 }}
          placeholder="PASSWORD"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
        />
        <LoadingButton
          text="OK"
          style={{ marginTop: 32 }}
          buttonTextStyle={{ color: Colors.accent400 }}
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
        />
        <TextInput
          style={{ marginTop: 8 }}
          placeholder="PASSWORD"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
        />
        <TextInput
          style={{ marginTop: 8 }}
          placeholder="PASSWORD REPEAT"
          secureTextEntry
          selectTextOnFocus
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
        />
        <TextInput
          style={{ marginTop: 8 }}
          placeholder="NICKNAME"
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
        />
        <View
          style={{ flexDirection: 'row', marginTop: 8, alignSelf: 'stretch', alignItems: 'center' }}
        >
          <TextInput
            style={{ flex: 1 }}
            placeholder="CODE"
            selectionColor={Colors.accent100}
            underlineColorAndroid={Colors.accent400}
          />
          <Button
            text="GET CODE"
            disabled={false}
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
