import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableNativeFeedback
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from '../assets/Theme'

/**
 * implement of material design
 * https://www.google.com/design/spec/patterns/navigation-drawer.html#navigation-drawer-specs
 */
class NavigationView extends Component {

  static propTypes = {
    selectedIndex: PropTypes.number,
    onProfilePress: PropTypes.func,
    onNavItemPress: PropTypes.func,
    userInfo: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired
    })
  }

  static defaultProps = {
    userInfo: {
      id: -1,
      name: 'Not login',
      email: 'Click to login',
      avatar: ''
    }
  }

  renderHeader() {
    const { onProfilePress, userInfo } = this.props;

    return (
      <View style={styles.header}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          onPress={onProfilePress}
        >
          <View
            style={styles.avatar}
          >
            <Icon name="md-person" size={32} style={{ color: 'white' }} />
          </View>
        </TouchableNativeFeedback>
        <Text style={styles.name} numberOfLines={1} onPress={onProfilePress}>{userInfo.name}</Text>
        <Text style={styles.email} numberOfLines={1} onPress={onProfilePress}>{userInfo.email}</Text>
      </View>
    );
  }
  
  renderSection(iconName, title, index) {
    const { selectedIndex, onNavItemPress } = this.props;

    let sectionStyle = [styles.section]
    let titleStyle = [styles.sectionTitle]
    if (selectedIndex == index) {
      titleStyle.push({
        color: Colors.accent100
      })
    }
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackground()}
        onPress={() => {onNavItemPress && onNavItemPress(index, title)}}
      >
        <View style={sectionStyle}>
          <Icon name={iconName} size={24} color={selectedIndex == index ? Colors.accent100 : "gray"} style={styles.sectionIcon}/>
          <Text style={titleStyle} numberOfLines={1}>{title}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }

  renderDivider() {
    return (
      <View
        style={styles.divider}
      />
    );
  }

  renderSections() {
    const { userInfo } = this.props

    return (
      <View style={styles.sections}>
        {this.renderSection("md-time", 'Schedule', 0)}
        {this.renderSection('md-calendar', 'History', 1)}
        {userInfo.id != -1 && this.renderDivider()}
        {userInfo.id != -1 && this.renderSection('md-exit', 'Logout', -1)}
      </View>
    );
  }

  render() {
    return (
      <ScrollView>
        {this.renderHeader()}
        {this.renderSections()}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary500,
    height: 148,
  },
  avatar: {
    backgroundColor: 'gray',
    top: 16,
    left: 16,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 32,
    borderColor: 'white'
  },
  name: {
    marginTop: 28,
    marginLeft: 16,
    width: 228,
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  email: {
    marginLeft: 16,
    width: 228,
    color: 'white'
  },
  sections: {
    paddingTop: 8
  },
  section: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionIcon: {
    marginLeft: 16,
    marginRight: 16,
    width: 24,
    textAlign: 'center'
  },
  sectionTitle: {
    marginLeft: 16,
    width: 212,
    fontWeight: '600',
    opacity: 0.87
  },
  divider: {
    marginTop: 8,
    backgroundColor: 'black',
    opacity: 0.1,
    height: 1
  }
})

export default NavigationView
