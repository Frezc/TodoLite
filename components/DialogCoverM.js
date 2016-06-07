import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  BackAndroid
} from 'react-native'
import Button from './Button'
import Keyboard from './Keyboard'

class DialogCover extends Component {

  // initial state
  static propTypes = {
    children: PropTypes.element,
    title: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      onPress: PropTypes.func
    })),
    onRequestClose: PropTypes.func.isRequired,
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
      content: props.children,
      actions: props.actions,
      noPadding: props.noPadding,

      dialogTop: new Animated.Value(0)
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
    this.state.dialogTop.setValue(0)
  }

  close() {

    this.setState({
      visible: false
    })
  }

  fitKeyboard = (isfit) => {
    Animated.spring(
      this.state.dialogTop,
      {
        toValue: isfit ? -120 : 0
      }
    ).start()
  }

  onKeyboardHide = () => {
    this.fitKeyboard(false)    
  }

  onKeyboardShow = () => {
    this.fitKeyboard(true)
  }

  componentDidMount() {
    Keyboard.addEventListener('keyboardDidHide', this.onKeyboardHide)
    Keyboard.addEventListener('keyboardDidShow', this.onKeyboardShow)
  }

  componentWillUnmount() {
    Keyboard.removeEventListener('keyboardDidHide', this.onKeyboardHide)
    Keyboard.removeEventListener('keyboardDidShow', this.onKeyboardShow)
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
      <Modal
        onRequestClose={onRequestClose}
        visible={this.state.visible}
        transparent
      >
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View style={[styles.root, { height: height - 24, width: width }]}>
            <TouchableWithoutFeedback>
              <Animated.View style={[styles.dialog, { top: this.state.dialogTop }]}>
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
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  render() {
    return this.renderDialog()
  }
}


const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    elevation: 2,        // fix android elevation bug
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.54)',
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
