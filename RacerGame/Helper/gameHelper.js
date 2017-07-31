/**
 * @constructor function to provide game helper functions.
 */
gameUtil.Helper = function () {}
/**
 * @static random function to generate {Array} of random unique numbers based on the <int>num<int>
 * @param num
 *        A positive whole number always greater than zero.
 * @returns {Array} of random unique numbers from 1 to num otherwise returns empty.
 *
 */
gameUtil.Helper.randomUniqueNumbers = function (num) {
  var arr = []
  if (num > 0) {
    while (arr.length < num) {
      var randomNumber = Math.ceil(Math.random() * num)
      if (arr.indexOf(randomNumber) > -1) continue
      arr[arr.length] = randomNumber
    }
  }
  return arr;
}