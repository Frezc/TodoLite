import SchedulePage from '../containers/SchedulePage'
import HistoryPage from '../containers/HistoryPage'
import LoginPage from '../containers/LoginPage'
import NeedAuthPage from '../containers/NeedAuthPage'
import TodoPage from '../containers/TodoPage'

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
    name: 'NeedAuth',
    component: NeedAuthPage
  },
  todo: {
    name: 'Todo',
    component: TodoPage
  }
}

router.initialPage = router.schedule

export default router;
