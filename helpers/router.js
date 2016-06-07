import SchedulePage from '../containers/SchedulePage'
import HistoryPage from '../containers/HistoryPage'
import LoginPage from '../containers/LoginPage'
import NeedAuthPage from '../components/NeedAuth'
import TodoPage from '../containers/TodoPage'
import EditorPage from '../containers/EditorPage'

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
  },
  textEditor: {
    component: EditorPage
  }
}

router.initialPage = router.schedule

export default router;
