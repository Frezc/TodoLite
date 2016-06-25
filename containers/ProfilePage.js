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
import { showDialog, closeDialog, showConfirmDialog, showLoadingDialog } from '../actions/view'
import { fetchRefreshUser, fetchUpdateUser } from '../actions/network'

const ModifiedActions = [{
  title: 'Revert', iconName: 'undo', show: 'always', iconColor: 'white'
},{
  title: 'Save', iconName: 'save', show: 'always', iconColor: 'white'
}]

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
    loading: false,
    nickname: this.props.nickname
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

  onActionSelected = index => {
    const { dispatch } = this.props
    switch (index) {
      case 0:
        dispatch(showConfirmDialog('Revert', 'This operation is not reversible', (result) => {
          switch (result) {
            case 'OK':
              this.setState({
                nickname: this.props.nickname
              })
              break
          }
          this.onCloseDialog()
        }))
        break

      case 1:
        dispatch(showLoadingDialog('Updating...'))
        dispatch(fetchUpdateUser({
          nickname: this.state.nickname
        })).then(() => {
          this.onCloseDialog()
        })
        break
    }
  }

  hasModified = () => {
    return this.state.nickname !== this.props.nickname
  }

  changeName = () => {
    const { dispatch } = this.props
    this.temp.nickname = this.state.nickname
    dispatch(showDialog({
      title: 'Change name (1 ~ 32)',
      content: (
        <TextInput
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          autoFocus
          defaultValue={this.temp.nickname}
          maxLength={32}
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
          if (this.state.nickname != this.temp.nickname) {
            // update name
            this.setState({
              nickname: this.temp.nickname
            })
          }
          this.onCloseDialog()
        }
      }]
    }))
  }

  changePassword = () => {

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
    const { avatar, email, created_at, todo, layside, complete, abandon } = this.props

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
            value: this.state.nickname
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
          style={styles.section}
          title="Change password"
          onPress={this.changePassword}
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
    return (
      <View style={styles.fillParent}>
        <Toolbar
          navIconName="arrow-back"
          title={'Profile'}
          onIconClicked={this.onBackPress}
          actions={this.hasModified() ? ModifiedActions : []}
          onActionSelected={this.onActionSelected}
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
