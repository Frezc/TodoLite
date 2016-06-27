/**
 * Created by Frezc on 2016/6/26.
 */
import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import Page from './ToolbarPage'
import { connect } from 'react-redux'
import Section from '../components/WechartSection'
import router from '../helpers/router'

class SettingsPage extends Page {


  toChangePw = () => {
    this.props.navigator.push(router.changePw)
  }

  toAbout = () => {
    this.props.navigator.push(router.about)
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
  }
})

function select(state, ownProps) {
  return {

  }
}

export default connect(select)(SettingsPage)
