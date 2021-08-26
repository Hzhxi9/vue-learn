export default function parse(template) {
  const stack = [];

  let root = null,
    html = template;

  while (html.trim()) {
    if (html.indexOf("<!--") === 0) {
      /**截取注释符号 */
      html = html.slice(html.indexOf("-->") + 3);
      continue;
    }

    const startIdx = html.indexOf("<");

    /**开始位置一开始就是开始标签 */
    if (startIdx === 0) {
      if (html.indexOf("</") === 0) parseEnd() /**处理自闭和标签 */;
      else parseStartTag() /**处理开始标签 */;
    } else if (startIdx > 0) {
      /**
       * 说明中间存在一段文本内容
       * 在html中找到下一个标签的开始位置
       */
      const nextStartIdx = html.indexOf("<");

      /**如果栈为空，则说明这段文本不属于任何一个元素，直接丢弃 */
      if (stack.length) processChars(html.slice(0, nextStartIdx));

      /**截取开始标签后面的内容 */
      html = html.slice(nextStartIdx);
    } else {
      //
    }
  }
  return root;

  /**
   * 匹配开始标签
   * 比如<div id="app"></div>
   **/
  function parseStartTag() {
    /**先找到开始标签的结束位置 */
    const end = html.indexOf(">");

    /**解析开始标签里面的内容，标签名、属性， 比如div，id="app" */
    const content = html.slice(1, end);

    /**截取html, 将上面解析的内容从html字符串中剔除 */
    html = html.slice(end + 1);

    /**找到第一个空格的索引 */
    const firstSpaceIdx = content.indexOf(" ");

    let tagName = "",
      attrsStr = "";

    if (!~firstSpaceIdx) {
      /**没有找到空格，代表没有属性，比如<div></div> */
      tagName = content;
      attrsStr = "";
    } else {
      /**获取标签名以及属性字符串 */
      tagName = content.slice(0, firstSpaceIdx);
      attrsStr = content.slice(firstSpaceIdx + 1);
    }

    /**获取属性数组 */
    const attrs = attrsStr ? attrsStr.split(" ") : [];

    /**获取属性map对象 */
    const attrsMap = processAttrs(attrs);

    /**生成AST对象 */
    const elementAST = generateAST(tagName, attrsMap);

    /**当前根节点不存在时， 说明当前节点为整个模板字符串的第一个节点 */
    if (!root) root = elementAST;

    /**
     * 将AST对象push到栈中
     * 当遇到结束标签的时候就将栈顶中AST对象pop出来，此时就是一对了
     */
    stack.push(elementAST);

    /**
     * 处理自闭合标签
     * 则直接调用end方法，进入闭合标签的处理截断，不入栈
     */
    if (isUnaryTag(tagName)) processElement();
  }

  /**
   * 处理结束标签
   */
  function parseEnd() {
    /**将结束标签从html字符串中截取掉 */
    html = html.slice(html.indexOf(">") + 1);
    /**处理栈顶元素 */
    processElement();
  }

  /**
   * 处理元素的闭合标签时候会调用该方法
   * 进一步处理元素上的各个属性，将处理结果放到attr属性上
   */
  function processElement() {
    /**弹出栈顶元素，进一步处理该元素 */
    const curEle = stack.pop();

    const stackLen = stack.length;

    /**进一步处理AST对象的rawAttr对象 {attrName: attrValue, ...} */
    const { tag, rawAttrs } = curEle;

    curEle.attrs = {};

    /**属性对象组成的keys数组 */
    const propertyArr = Object.keys(rawAttrs);

    if (propertyArr.includes("v-model"))
      processVModel(curEle) /**处理v-model指令 */;
    else if (propertyArr.find((property) => property.match(/^v-bind:(.*)/)))
      processVBind(
        curEle,
        RegExp.$1,
        rawAttrs[`v-bind:${RegExp.$1}`]
      ) /**处理v-bind指令 */;
    else if (propertyArr.find((property) => property.match(/^v-on:(.*)/)))
      processVOn(
        curEle,
        RegExp.$1,
        rawAttrs[`v-on:${RegExp.$1}`]
      ) /**处理v-on指令 */;

    /**节点处理完以后让其与父节点产生联系 */
    if (stackLen) {
      stack[stackLen - 1].children.push(curEle);
      curEle.parent = stack[stackLen - 1];
    }
  }

  /**
   * 处理文本
   * @param {*} text
   */
  function processChars(text) {
    if (!text.trim()) return;

    const textAST = {
      type: 3,
      text,
    };

    if (text.match(/{{(.*)}}/)) {
      textAST.exp = RegExp.$1.trim();
    }

    stack[stack.length - 1].children.push(textAST);
  }
}

/**
 * 判断是否自闭合标签
 * @param {*} tagName
 * @returns
 */
function isUnaryTag(tagName) {
  const unaryTags = ["input"];
  return unaryTags.includes(tagName);
}

/**
 * 处理属性数组，得到属性map对象
 * @param {*} attrs
 * @returns
 */
function processAttrs(attrs) {
  let attrsMap = {};
  for (const attr of attrs) {
    const [attrName, attrValue] = attr.split("=");
    attrsMap[attrName] = attrValue.replace(/"/g, "");
  }
  return attrsMap;
}

/**
 * 生成AST对象
 * @param {*} tagName
 * @param {*} attrs
 * @returns
 */
function generateAST(tagName, attrs) {
  return {
    type: 1,
    tag: tagName,
    rawAttrs: attrs,
    children: [],
  };
}

/**
 * 处理v-model指令，将处理结果放到curElm对象身上
 * @param {*} elm
 */
function processVModel(elm) {
  const { tag, rawAttrs, attrs } = elm;
  const { type, "v-model": vModelValue } = rawAttrs;

  if (tag === "input") {
    if (/text/.test(type))
      attrs.vModel = { tag, type: "text", value: vModelValue };
    else if (/checkbox/.test(type))
      attrs.vModel = { tag, type: "checkbox", value: vModelValue };
  } else if (tag === "select") {
    attrs.vModel = { tag, value: vModelValue };
  } else if (tag === "textarea") {
    attrs.vModel = { tag, value: vModelValue };
  }
}

/**
 * 处理v-bind指令
 * @param {*} elm
 * @param {*} bindKey
 * @param {*} bindValue
 */
function processVBind(elm, bindKey, bindValue) {
  elm.attrs.vBind = { [bindKey]: bindValue };
}

/**
 * 处理v-on指令
 * @param {*} elm
 * @param {*} vOnKey
 * @param {*} vOnValue
 */
function processVOn(elm, vOnKey, vOnValue) {
  elm.attrs.vOn = { [vOnKey]: vOnValue };
}
