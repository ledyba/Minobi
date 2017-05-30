/**
 * @param {TouchList} touchList
 * @param {number} identifier
 * @returns {Touch} touch
 */
export function findTouchEvent(touchList, identifier) {
  // https://www.w3.org/TR/touch-events/
  for (var i = 0; i < touchList.length; i++) {
    if (touchList[i].identifier === identifier) {
      return touchList[i];
    }
  }
  return null;
}

/**
 * @param {string} str
 * @returns {Uint8Array} array
 */
export function decodeBase64(str) {
  var raw = window.atob(str);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));
  for (var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}
