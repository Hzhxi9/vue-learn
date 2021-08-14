function smartRepeat(templateString) {
  /**指针 */
  let idx = 0,
    len = templateString.length;

  /**存放数字和字符串的栈 */
  const numberStack = [],
    stringStack = [];

  /**字符串备份 */
  let rect = templateString;

  /**循环字符串 */
  while (idx < len - 1) {
    /**剪切字符串 */
    rect = templateString.slice(idx);

    if (/^\d+/.test(rect)) {
      /**匹配数字 */
      let times = rect.match(/^(\d+)/)[1];
      /**数字入栈 */
      numberStack.push(times);
      /**空字符串入栈 */
      stringStack.push("");
      /**索引修改成数字长度加[ */
      idx += times.length + 1;
    } else if (/^\w+/.test(rect)) {
      /**匹配字母 */
      let word = rect.match(/^(\w+)/)[1];
      /**修改字母栈最后的元素 */
      stringStack[stringStack.length - 1] = word;
      /**索引修改为字符串长度 */
      idx += word.length;
    } else if (~rect.indexOf("]")) {
      /**匹配]结束 */

      /**数字出栈 */
      const num = numberStack.pop();
      /**字母出栈 */
      const str = stringStack.pop();

      /**重复字符串 */
      stringStack[stringStack.length - 1] += str.repeat(num);
      idx++;
    }
  }
  return stringStack[0].repeat(numberStack[0]);
}

console.log(smartRepeat("3[2[abc]2[d]]"));
