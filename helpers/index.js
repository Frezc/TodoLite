import { ToastAndroid } from 'react-native';

export function generateRandomStringArray(length, str = 'random') {
  let array = new Array(length)
  for(let i = 0; i < length; i++) {
    array[i] = str
  }
  
  return array
}

/**
 * fetch with auto retry
 * @param url request url
 * @param params fetch params with { retry(int, default 3), deltaTime(int, default 1000(ms)) }
 */
export function fetchR(url, params) {
  params = Object.assign({
    retry: 3,
    deltaTime: 1000
  }, params);

  return new Promise((resolve, reject) => {
    const wrappedFetch = (retry) => {
      fetch(url, params)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          if (retry > 0) {
            setTimeout(() => {
              wrappedFetch(retry - 1);
            }, params.deltaTime);
          } else {
            reject(error);
          }
        })
    };
    wrappedFetch(params.retry);
  });
}

/**
 * resolve laravel validation error object
 * {
 *   [param name]: ["error messages", ..]
 * }
 * @param errMsg array ["error messages"]
 */
export function resolveValidationError(errMsg) {
  let messages = []
  for (const msgs of Object.values(errMsg)) {
    for (const msg of msgs) {
      messages.push(msg)
    }
  }
  return messages
}

/**
 * handle error response
 * @param response
 */
export function resolveErrorResponse(response) {
  switch (response.status) {
    case 430:
      ToastAndroid.show('Wrong code. Please retry.', ToastAndroid.SHORT)
      break
    case 431:
      ToastAndroid.show('Code is expired. Please re-send email.', ToastAndroid.SHORT)
      break
    case 400:
      response.json().then(json => {
        ToastAndroid.show(resolveValidationError(json.error).join(' '), ToastAndroid.SHORT)
      })
      break
    default:
      response.text().then(text => {
        ToastAndroid.show(text, ToastAndroid.SHORT)
      })
  }
}

/**
 * construct query string by params obj
 * @param params
 */
export function constructQuery(params = {}) {
  let query = []
  for (const key of Object.keys(params)) {
    query.push(key + '=' + params[key])
  }
  return query.join('&')
}

/**
 * format date to string
 * todo
 * @param date
 */
export function formatDate(date) {
  const year = date.getFullYear()
  const month = `0${date.getMonth()}`.slice(-2)
  const day = `0${date.getDate()}`.slice(-2)
  const hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
  const minute = `0${date.getMinutes()}`.slice(-2)
  const ampm = date.getHours() > 12 ? 'pm' : 'am'

  return `${year}-${month}-${day} ${hour}:${minute} ${ampm}`
}
