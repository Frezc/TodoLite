import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'
import Button from './Button'

/**
 * this is departed
 */
class DialogCover extends Component {

  // initial state
  static propTypes = {
    children: PropTypes.element,
    title: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      onPress: PropTypes.func
    })),
    onRequestClose: PropTypes.func,
    noPadding: PropTypes.bool   // for list
  }

  static defaultProps = {
    noPadding: false
  }

  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      title: props.title,
      fadeAnim: new Animated.Value(0),
      content: props.children,
      actions: props.actions,
      noPadding: props.noPadding
    }
  }

  /**
   *
   * @param config same as props
   */
  show(config) {
    this.setState(Object.assign({
      visible: true,
      title: null,
      actions: [],
      noPadding: false
    }, config))

    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 300
      }
    ).start()
  }

  close() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 0,
        duration: 300
      }
    ).start(({finished}) => {
      if (finished) {
        this.setState({
          visible: false
        })
      }
    })
  }

  renderDialog() {
    const { title, content, actions, noPadding } = this.state;
    const { onRequestClose } = this.props
    const { height, width } = Dimensions.get('window')

    const showActions = actions && actions.length > 0
    const contentStyle = {
      marginHorizontal: noPadding ? 0 : 24,
      marginBottom: noPadding ? 0 : showActions ? (content.type === ScrollView ? 0 : 22) : 22
    }

    return (
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <Animated.View style={[styles.root, { height: height - 24, width: width, opacity: this.state.fadeAnim }]}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              {title && <Text style={styles.title}>{title}</Text>}
              <View style={contentStyle}>
                {content}
              </View>
              {showActions &&
              <View style={styles.actions}>
                {actions.map((action, i) =>
                  <Button
                    key={i}
                    text={action.text}
                    onPress={action.onPress}
                    style={styles.actionPadding}
                  />
                )}
              </View>
              }
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }

  renderEmpty() {

    return (
      <View style={styles.empty} />
    )
  }

  render() {
    if (this.state.visible) {
      return this.renderDialog()
    } else {
      return this.renderEmpty()
    }
  }
}


const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    elevation: 2,        // fix android elevation bug
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.56)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dialog: {
    backgroundColor: 'white',
    width: 280,
    elevation: 3,
    borderRadius: 1,
    paddingTop: 20,
  },
  title: {
    marginHorizontal: 24,
    marginBottom: 16,
    color: 'black',
    fontWeight: '600',
    fontSize: 20
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8
  },
  actionPadding: {
    marginLeft: 8
  },
  empty: {
    position: 'absolute',
    width: 0,
    height: 0
  }
})

export default DialogCover
