import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback
} from 'react-native';
import { Colors } from '../assets/Theme'

class ViewPagerIndicator extends Component {

  static propTypes = {
    style: PropTypes.object,
    titles: PropTypes.arrayOf(PropTypes.string).isRequired,
    onPress: PropTypes.func          // params: (index, title)
  }

  static defaultProps = {
    style: {}
  }

  /**
   * indicator offset [0, length of titles - 1]
   * @type {number}
   */
  offset = 0

  /**
   * Why?
   * Using setState won't expect to 60fps
   * @param offset
   */
  setOffset = (offset) => {
    const { leftPadding, rightPadding } = this.getIndicatorSpec(offset)

    this.refs.leftPadding.setNativeProps({
      style: { flex: leftPadding }
    })
    this.refs.rightPadding.setNativeProps({
      style: { flex: rightPadding }
    })
    // this.refs.indicator.setNativeProps({
    //   style: {
    //     transform: [{translateX: offset * 300}]
    //   }
    // })
  }

  /**
   * get and update the offset of indicator
   * @param offset
   * @returns {{indicatorPercent: number, leftPadding: number, rightPadding: number}}
   */
  getIndicatorSpec = (offset = this.offset) => {
    // update offset
    this.offset = offset
    
    const { titles } = this.props;

    const indicatorPercent = 1 / titles.length;
    const leftPadding = offset / titles.length;
    const rightPadding = 1 - indicatorPercent - leftPadding;
    
    return { indicatorPercent, leftPadding, rightPadding }
  }

  render() {
    const { style, titles, onPress } = this.props;
    
    const { indicatorPercent, leftPadding, rightPadding } = this.getIndicatorSpec()

    return (
      <View style={[styles.root, style]}>
        <View style={styles.titles}>
          {titles.map((title, index) => {
            return (
              <TouchableNativeFeedback
                key={index}
                onPress={() => {
                  onPress && onPress(index, title)
                }}
              >
                <View style={styles.title}>
                  <Text style={styles.titleText}>
                    {title}
                  </Text>
                </View>
              </TouchableNativeFeedback>
            );
          })}
        </View>

        <View
          style={styles.indicators}
        >
          <View style={{ flex: leftPadding }} ref="leftPadding" />
          <View style={[styles.indicator, { flex: indicatorPercent }]} />
          <View style={{ flex: rightPadding }} ref="rightPadding" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    height: 36,
    flexDirection: 'column',
    backgroundColor: Colors.primary500
  },
  titles: {
    flex: 1,
    flexDirection: 'row'
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    color: 'white',
    fontWeight: '600',
  },
  indicators: {
    marginTop: -2,
    height: 2,
    flexDirection: 'row'
  },
  indicator: {
    backgroundColor: Colors.accent100
  }
})

export default ViewPagerIndicator
