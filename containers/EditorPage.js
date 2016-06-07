/**
 * Created by Frezc on 2016/6/3.
 */
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  TextInput
} from 'react-native';
import Toolbar from '../components/Toolbar'
import { Colors } from '../assets/Theme'

const CHANGED_ACTIONS = [{
  title: 'Revert', iconName: 'undo', show: 'always', iconColor: 'white'
}, {
  title: 'Done', iconName: 'done', show: 'always', iconColor: 'white'
}]

class EditorPage extends Component {

  static propTypes = {
    title: PropTypes.string,
    defaultValue: PropTypes.string,
    editComplete: PropTypes.func
  }

  static defaultProps = {
    title: ''
  }

  constructor(props) {
    super(props)

    this.state = {
      value: props.defaultValue,
      actions: [],
      height: 52,
    }
  }

  onBackPress = () => {
    this.props.navigator.pop()
  }

  onChange = event => {
    this.setState({
      actions: CHANGED_ACTIONS,
      value: event.nativeEvent.text,
      height: event.nativeEvent.contentSize.height + 25,
    });
  }

  onActionSelected = index => {
    const { editComplete } = this.props
    switch (index) {
      case 0:
        this.setState({
          actions: [],
          value: this.props.defaultValue
        })
        break
      case 1:
        editComplete(this.state.value)
        this.onBackPress()
        break
    }
  }

  render() {
    const { title } = this.props
    const { value, actions, height } = this.state

    console.log('height', height);
    
    return (
      <View style={styles.fillParent}>
        <Toolbar
          navIconName="arrow-back"
          title={title}
          onIconClicked={this.onBackPress}
          actions={actions}
          onActionSelected={this.onActionSelected}
        />
        <TextInput
          style={[styles.input, { height: height }]}
          selectionColor={Colors.accent100}
          underlineColorAndroid={Colors.accent400}
          multiline
          // numberOfLines={12}
          value={value}
          onChange={this.onChange}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fillParent: {
    flex: 1
  },
  input: {
    margin: 8
  }
})

export default EditorPage
