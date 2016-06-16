
export const HOST = '192.168.2.50'
export const APPIDENTITY = 'todolite_android'

export const TodoType = ['default', 'work', 'study', 'entertainment', 'trivia', 'outOfDoor']

// icon set: MaterialIcons
export const TypeIcon = {
  default: 'schedule',
  entertainment: 'videogame-asset',
  work: 'work',
  study: 'book',
  trivia: 'pets',
  outOfDoor: 'directions-walk'
}

export const TypeText = {
  default: 'Default',
  entertainment: 'Entertainment',
  work: 'Work',
  study: 'Study',
  trivia: 'Trivia',
  outOfDoor: 'Go out'
}

export const StatusIcon = {
  todo: 'alarm',
  complete: 'done-all',
  layside: 'block',
  abandon: 'clear'
}

export const StatusText = {
  todo: 'To do',
  complete: 'Complete',
  layside: 'Lay side',
  abandon: 'Abandon'
}

/**
 * 生成用于HistoryPage的YearPicker里的年份数据
 * 从 2016 到 今年
 */
const years = []
const toYear = new Date().getFullYear()
for (let i = 2016; i <= toYear; i++) {
  years.push(i)
}
export const yearPickerItems = years.map(year => {
  return {
    label: String(year),
    value: year
  }
})
