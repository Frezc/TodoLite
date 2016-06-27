import SchedulePage from '../containers/SchedulePage'
import HistoryPage from '../containers/HistoryPage'
import LoginPage from '../containers/LoginPage'
import NeedAuthPage from '../components/NeedAuth'
import TodoPage from '../containers/TodoPage'
import EditorPage from '../containers/EditorPage'
import ProfilePage from '../containers/ProfilePage'
import ChangePasswordPage from '../containers/ChangePasswordPage'
import SettingsPage from '../containers/SettingsPage'
import ResetPwPage from '../containers/ResetPwPage'
import AboutPage from '../containers/AboutPage'

const router = {
  schedule: {
    name: 'Schedule',
    component: SchedulePage
  },
  history: {
    name: 'History',
    component: HistoryPage
  },
  login: {
    name: 'Login',
    component: LoginPage
  },
  needAuth: {
    name: 'NeedAuth',
    component: NeedAuthPage
  },
  todo: {
    name: 'Todo',
    component: TodoPage
  },
  textEditor: {
    component: EditorPage
  },
  profile: {
    component: ProfilePage
  },
  changePw: {
    component: ChangePasswordPage
  },
  settings: {
    component: SettingsPage
  },
  resetPw: {
    component: ResetPwPage
  },
  about: {
    component: AboutPage
  }
}

router.initialPage = router.schedule

export default router;
