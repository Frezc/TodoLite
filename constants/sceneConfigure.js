import {
  Navigator
} from 'react-native';

export const swipeWithoutGestures = Object.assign({}, Navigator.SceneConfigs.HorizontalSwipeJump, {
  gestures: {}
})

