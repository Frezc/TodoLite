/**
 * Created by Frezc on 2016/6/27.
 */
import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Linking
} from 'react-native'
import Page from './ToolbarPage'

class AboutPage extends Page {

  to = url => {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err))
  }

  getTitle() {
    return 'About'
  }

  shouldLockDrawer() {
    return false
  }

  renderContents() {
    return (
      <View style={styles.root}>
        <Text>
          这是个人的一个开源项目，地址→
          <Text
            style={styles.linkText}
            onPress={() => this.to('https://github.com/Frezc/TodoLite')}>
            https://github.com/Frezc/TodoLite
          </Text>
          ，如果你觉得有什么需要改进的地方可以发个issue或pr。
        </Text>
        <Text>
          开发者:&nbsp;
          <Text
            style={styles.linkText}
            onPress={() => this.to('http://frezc.com/')}>
            Frezc
          </Text>
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    margin: 8
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline'
  }
})

export default AboutPage
