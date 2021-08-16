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
  function parseStartTag() {
    /**先找到开始标签的结束位置 */
    const end = html.indexOf(">");

    /**解析开始标签里的内容<内容>, 标签名+属性， 比如： div, id="app" */
    const content = html.slice(1, end);

    /**截取整个html， 将上面解析的内容从html字符串中删除 */
    html = html.slice(end + 1);

    /**找到第一个空格位置 */
    const firstSpaceIdx = content.indexOf(" ");

    /**标签名和属性字符串 */
    let tagName = "",
      attrsStr = "";

    if (~firstSpaceIdx) {
      /**
       * 没有空格，则认为content就是标签名
       * 比如<h3></h3>,这种情况content = h3
       **/
      tagName = content;
      attrsStr = "";
    } else {
      /**截取到开始到第一个空格的位置为标签名 */
      tagName = content.slice(0, firstSpaceIdx);
      /**content剩下的内容就是属性， 比如id = "app" xx = "xx" */
      attrsStr = content.slice(firstSpaceIdx + 1);
    }

    /**得到属性数组, [id="app", xx="xx"]*/
    const attrs = attrsStr ? attrsStr.split(" ") : [];

    /**进一步解析属性数组，得到一个map对象 */
    const attrMap = parseAttrs(attrs);

    /**生成AST对象 */
    const elementAST = generateAST(tagName, attrMap);

    /**如果根节点不存在，说明当前节点为整个模板的第一个节点 */
    if (!root) root = elementAST;

    /**
     * 将ast对象push到栈中
     * 当遇到结束标签的时候，就将栈顶的AST对象pop出
     */
    stack.push(elementAST);

    /**自闭合标签，则直接调用end方法， 进入闭合标签的处理阶段，不入栈 */
    if (isUnaryTag(tagName)) parseElement();
  }

  /**
   * 处理结束标签 比如<div id="app">...</div>
   */
  function parseEnd() {
    /**将结束标签从html字符串中截取掉  */
    html = html.slice(html.indexOf(">") + 1);
    /**处理栈顶元素 */
    parseElement();
  }

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

/**
 * 处理属性
 */
function parseAttrs(attrs) {}
