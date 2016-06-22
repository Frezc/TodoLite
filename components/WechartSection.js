/**
 * Created by Frezc on 2016/6/17.
 */
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ToastAndroid,
  TouchableNativeFeedback
} from 'react-native';

class WechartSection extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    rightItem: PropTypes.shape({
      type: PropTypes.oneOf(['text', 'image']).isRequired,
      value: PropTypes.any.isRequired            // if type is image, value should be the uri
    }).isRequired,
    disabled: PropTypes.bool,
    onPress: PropTypes.func
  }

  static propTypes = {
    disabled: false
  }

  renderRigthItem = () => {
    const { type, value } = this.props.rightItem

    switch (type) {
      case 'text':
        return (
          <Text
            style={styles.text}
          >
            {value}
          </Text>
        )
      case 'image':
        return (
          <Image
            style={styles.image}
            source={{ uri: value }}
          />
        )
    }

    return null
  }

  render() {
    const { style, title, disabled, onPress } = this.props
    return (
      <TouchableNativeFeedback
        disabled={disabled}
        onPress={onPress}
      >
        <View
          style={[styles.root, style]}
        >
          <Text
            style={styles.title}
          >
            {title}
          </Text>
          {this.renderRigthItem()}
        </View>
      </TouchableNativeFeedback>

    )
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  title: {
    marginVertical: 12,
    marginLeft: 12,
    fontSize: 16,
    color: 'rgba(0,0,0,0.87)'
  },
  text: {
    marginRight: 12,
    fontSize: 13,
    color: 'rgba(0,0,0,0.54)'
  },
  image: {
    width: 62,
    height: 62,
    marginRight: 12,
    marginVertical: 4
  }
})

export default WechartSection
