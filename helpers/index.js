
export function generateRandomStringArray(length, str = 'random') {
  let array = new Array(length)
  for(let i = 0; i < length; i++) {
    array[i] = str
  }
  
  return array
}
