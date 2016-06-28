/**
 * Created by Frezc on 2016/6/26.
 */
import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import Page from './ToolbarPage'
import { connect } from 'react-redux'
import Section from '../components/WechartSection'
import router from '../helpers/router'
import { logout } from '../actions/network'

class SettingsPage extends Page {


  toChangePw = () => {
    this.props.navigator.push(router.changePw)
  }

  toAbout = () => {
    this.props.navigator.push(router.about)
  }

  toLogout = () => {
    const { dispatch, navigator } = this.props
    dispatch(logout())
    navigator.pop()
  }

  getTitle = () => {
    return 'Settings'
  }

  renderContents() {
    return (
      <ScrollView>
        <Section
          style={styles.firstSection}
          title="Change password"
          onPress={this.toChangePw}
        />
        <Section
          style={styles.firstSection}
          title="About"
          onPress={this.toAbout}
        />
        <Section
          style={styles.section}
          title="Logout"
          onPress={this.toLogout}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  fillParent: {
    flex: 1
  },
  firstSection: {
    marginTop: 8
  },
  section: {
    marginTop: 1
  }
})

function select(state, ownProps) {
  return {

  }
}

export default connect(select)(SettingsPage)
