/**
 * Created by Frezc on 2016/6/17.
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
import Toolbar from '../components/Toolbar'
import { Colors } from '../assets/Theme'
import Section from '../components/WechartSection'
import { connect } from 'react-redux';
import { showDialog, closeDialog } from '../actions/view'
import { fetchRefreshUser } from '../actions/network'

class ProfilePage extends Component {

  static propTypes = {
    avatar: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    todo: PropTypes.number.isRequired,
    layside: PropTypes.number.isRequired,
    complete: PropTypes.number.isRequired,
    abandon: PropTypes.number.isRequired
  }

  state = {
    loading: false
  }

  temp = {
    nickname: ''
  }

  onRefresh = () => {
    const { dispatch } = this.props
    this.setState({
      loading: true
    })
    dispatch(fetchRefreshUser())
      .then(() => {
        this.setState({
          loading: false
        })
      })
  }

  onBackPress = () => {
    this.props.navigator.pop()
  }

  onCloseDialog = () => {
    this.props.dispatch(closeDialog())
  }

  changeName = () => {
    const { dispatch, nickname } = this.props
    this.temp.nickname = nickname
    dispatch(showDialog({
      title: 'Change name (1 ~ 32)',
      content: (
        <TextInput
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          autoFocus
          defaultValue={this.temp.nickname}
          maxLength={30}
          onChangeText={text => this.temp.nickname = text}
        />
      ),
      onRequestClose: this.onCloseDialog,
      actions: [{
        text: 'CANCEL',
        onPress: this.onCloseDialog
      }, {
        text: 'OK',
        onPress: () => {
          if (nickname != this.temp.nickname) {
            // update name
          }
          this.onCloseDialog()
        }
      }]
    }))
  }

  renderRefreshControl = () => {
    const { loading } = this.state
    return (
      <RefreshControl
        colors={[Colors.accent100, Colors.accent200, Colors.accent400]}
        refreshing={loading}
        onRefresh={this.onRefresh}
      />
    )
  }

  renderContent() {
    const { avatar, nickname, email, created_at, todo, layside, complete, abandon } = this.props

    return (
      <ScrollView
        style={styles.fillParent}
        refreshControl={this.renderRefreshControl()}
      >
        <Section
          style={styles.firstSection}
          title="Avatar"
          rightItem={{
            type: 'image',
            value: avatar
          }}
        />
        <Section
          style={styles.section}
          title="Name"
          onPress={this.changeName}
          rightItem={{
            type: 'text',
            value: nickname
          }}
        />
        <Section
          style={styles.section}
          title="Email"
          rightItem={{
            type: 'text',
            value: email
          }}
        />
        <Section
          style={styles.section}
          title="Join at"
          rightItem={{
            type: 'text',
            value: created_at
          }}
        />
        <Section
          style={styles.firstSection}
          title="Todo"
          rightItem={{
            type: 'text',
            value: todo
          }}
        />
        <Section
          style={styles.section}
          title="Lay side"
          rightItem={{
            type: 'text',
            value: layside
          }}
        />
        <Section
          style={styles.section}
          title="Complete"
          rightItem={{
            type: 'text',
            value: complete
          }}
        />
        <Section
          style={styles.section}
          title="Abandon"
          rightItem={{
            type: 'text',
            value: abandon
          }}
        />
      </ScrollView>
    )
  }

  render() {
    const { token, loading, navigator } = this.props

    return (
      <View style={styles.fillParent}>
        <Toolbar
          navIconName="arrow-back"
          title={'Profile'}
          onIconClicked={this.onBackPress}
        />
        {this.renderContent()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fillParent: {
    flex: 1
  },
  section: {
    marginTop: 1
  },
  firstSection: {
    marginTop: 8
  }
})

function select(state, ownProps) {
  return {
    ...state.auth.user
  }
}

export default connect(select)(ProfilePage)
