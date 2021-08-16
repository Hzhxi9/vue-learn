/**
 * 解析模板字符串生成AST语法树
 * @param {*} template 模板字符串
 * @returns {AST} root ast语法树
 */
export default function parse(template) {
  /**存放所有未配对的开始标签的AST对象 */
  const stack = [];

  /**最终的AST语法树 */
  let root = null;

  let html = template;

  while (html.trim()) {
    /**过滤注释标签 */
    if (html.indexOf("<!--") === 0) {
      /**说明开始位置是一个注释标签，忽略掉 */
      html = html.slice(html.indexOf("-->") + 3);
      continue;
    }

    /**匹配开始标签 */
    const startIdx = html.indexOf("<");
    if (startIdx === 0) {
      if (html.indexOf("</") === 0) parseEnd() /**当前是闭合标签 */;
      else parseStartTag() /**处理开始标签 */;
    } else if (startIdx > 0) {
      /**说明在开始标签之前有一段文本内容，在html中找到下一个标签的开始位置 */
      const nextStartIdx = html.indexOf("<");

      /**如果栈为空，则说明这段文本不属于任何一个元素，直接丢弃，不作处理 */
      if (stack.length)
        processChars(
          html.slice(0, nextStartIdx)
        ) /**栈不为空， 处理这段文本，并将其放置到父元素的children属性中 */;

      html = html.slice(0, nextStartIdx);
    } else {
      /**没有匹配到开始标签， 整个html都为一段文本 */
    }
  }

  return root;

  /**
   * 解析开始标签
   * <div id="app"></div>
   */
  function parseStartTag() {}

  /**
   * 处理结束标签
   */
  function parseEnd() {}

  /**
   * 处理元素的闭合标签时会调用该方法
   * 进一步处理元素上的各个属性，将处理结果放到 attr 属性上
   */
  function parseElement() {}
}

/**
 * 处理文本
 * @param {*} text
 */
function processChars(text) {}
