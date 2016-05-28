
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
