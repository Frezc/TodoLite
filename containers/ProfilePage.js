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
  ScrollView
} from 'react-native';
import Toolbar from '../components/Toolbar'
import { Colors } from '../assets/Theme'
import Section from '../components/WechartSection'

class ProfilePage extends Component {

  state = {
    loading: false
  }

  onRefresh = () => {

  }

  onBackPress = () => {
    this.props.navigator.pop()
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
            value: 'https://cdn.v2ex.co/gravatar/7e6a95e05c71badaa57a302f448a4cd2?d=retro&r=pg&s=120'
          }}
        />
        <Section
          style={styles.section}
          title="Name"
          rightItem={{
            type: 'text',
            value: 'Frezc'
          }}
        />
        <Section
          style={styles.section}
          title="Email"
          rightItem={{
            type: 'text',
            value: '504021398@qq.com'
          }}
        />
        <Section
          style={styles.firstSection}
          title="Todo"
          rightItem={{
            type: 'text',
            value: 151
          }}
        />
        <Section
          style={styles.section}
          title="Lay side"
          rightItem={{
            type: 'text',
            value: 151
          }}
        />
        <Section
          style={styles.section}
          title="Complete"
          rightItem={{
            type: 'text',
            value: 151
          }}
        />
        <Section
          style={styles.section}
          title="Abandon"
          rightItem={{
            type: 'text',
            value: 151
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

export default ProfilePage
