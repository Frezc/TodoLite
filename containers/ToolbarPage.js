/**
 * Created by Frezc on 2016/6/26.
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid
} from 'react-native';
import Toolbar from '../components/Toolbar'
import { setDrawerLockMode, closeDialog } from '../actions/view'

class ToolbarPage extends Component {

  /**
   * one of ['normal', 'root']
   * @returns {string}
   */
  getPageType() {
    return 'normal'
  }

  /**
   * title in toolbar
   * @returns {string}
   */
  getTitle() {
    return ''
  }

  /**
   * toolbar actions
   * @returns {Array}
   */
  getActions() {
    return []
  }

  /**
   * at second normal page, override this method and return false
   * @returns {boolean}
   */
  shouldLockDrawer() {
    return true
  }

  /**
   * override this method if need response action selected
   */
  onActionSelected() {}

  onIconClicked = () => {
    if (this.getPageType() === 'root') {
      this.props.openDrawer()
    } else {
      this.props.navigator.pop()
    }
  }

  onCloseDialog = () => {
    const { dispatch } = this.props
    dispatch && dispatch(closeDialog())
  }

  /**
   * require redux
   * call super() at subclass
   */
  componentDidMount() {
    if (this.getPageType() !== 'root' && this.shouldLockDrawer()) {
      const { dispatch } = this.props;
      dispatch && dispatch(setDrawerLockMode('locked-closed'))
    }
  }

  componentWillUnmount() {
    if (this.getPageType() !== 'root' && this.shouldLockDrawer()) {
      const { dispatch } = this.props;
      dispatch && dispatch(setDrawerLockMode('unlocked'))
    }
  }

  /**
   * override this method to render
   */
  renderContents() {
    return null
  }

  /**
   * override this method to render page actions
   */
  renderActions() {
    return null
  }
  
  render() {
    return (
      <View style={styles.fillParent}>
        <Toolbar
          navIconName={this.getPageType() === 'root' ? "menu" : "arrow-back"}
          title={this.getTitle()}
          onIconClicked={this.onIconClicked}
          actions={this.getActions()}
          onActionSelected={this.onActionSelected}
        />
        {this.renderContents()}
        {this.renderActions()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fillParent: {
    flex: 1
  }
})

export default ToolbarPage
