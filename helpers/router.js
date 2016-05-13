import SchedulePage from '../containers/SchedulePage'
import HistoryPage from '../containers/HistoryPage'
import LoginPage from '../containers/LoginPage'
import NeedAuthPage from '../containers/NeedAuthPage'
import string from '../constants/string'

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
    name: 'needAuth',
    component: NeedAuthPage
  }
}

router.initialPage = router.schedule

export default router;
