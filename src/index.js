/**
 * Vue 构造函数
 * @param {*} options new Vue(options)时传递的配置对象
 */
// export default function Vue(options) {
//   this._init(options);
// }

var removeElement = function (nums, val) {
  let idx = nums.indexOf(val);
  while (idx > -1) {
    nums.splice(idx, 1);
    idx = nums.indexOf(val, idx + 1);
  }
  return nums;
};
console.log(removeElement([3, 2, 2, 3], 3));
