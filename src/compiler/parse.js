import { isUnaryTag } from "../utils";

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

      html = html.slice(nextStartIdx);
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

    if (!~firstSpaceIdx) {
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
  function parseElement() {
    /**弹出栈顶元素， 进一步处理该元素*/
    const curElement = stack.pop();

    const stackLen = stack.length;

    /**进一步处理AST对象中rawAttr对象{ attrName: attrValue, ... } */
    const { tag, rawAttr } = curElement;

    /**处理结果都放到attr对象上， 并删掉rawAttr对象中相应的属性 */
    curElement.attr = {};

    /**属性对象的key组成的数组 */
    const propertyArr = Object.keys(rawAttr);

    if (propertyArr.includes("v-model")) {
      /**处理v-model 指令 */
      processVModel(curElement);
    } else if (propertyArr.find(property => property.match(/^v-bind:(.*)/))) {
      /**处理v-bind指令， 比如<span v-bind:test="xx"></span> */
      processVBind(curElement, RegExp.$1, rawAttr[`v-bind:${RegExp.$1}`]);
    } else if (propertyArr.find(property => property.match(/^v-on:(.*)/))) {
      /**处理v-on指令， 比如<button v-on:click="add">add</button> */
      processVOn(curElement, RegExp.$1, rawAttr[`v-on:${RegExp.$1}`]);
    }

    /**节点处理完以后让其和父节点产生关系 */
    if (stackLen) {
      stack[stackLen - 1].children.push(curElement);
      curElement.parent = stack[stackLen - 1];
    }
  }

  /**
   * 处理文本
   * @param {*} text
   */
  function processChars(text) {
    /**去除空字符或者换行符 */
    if (!text.trim()) return;

    /**构造文本节点的AST */
    const textAst = {
      type: 3,
      text,
    };

    /**存在表达式 */
    if (text.match(/{{(.*)}}/)) textAst.exp = RegExp.$1.trim();

    /**将AST放到栈顶元素的children属性中 */
    stack[stack.length - 1].children.push(textAst);
  }
}

/**
 * 处理v-model指令， 将处理结果直接放到curElement对象身上
 * @param {*} curElement
 */
function processVModel(curElement) {
  const { tag, rawAttr, attr } = curElement;
  const { type, "v-model": vModelVal } = rawAttr;

  if (tag === "input") {
    if (/text/.test(type)) {
      /**<input type="text" v-model="value" />; */
      attr.vModel = { tag, type: "text", value: vModelVal };
    } else if (/checkbox/.test(type)) {
      /**<input type="checkbox" v-model="value" /> */
      attr.vModel = { tag, type: "checkbox", value: vModelVal };
    } else if (tag === "textarea") {
      /**<textarea v-model="value" /> */
      attr.vModel = { tag, value: vModelVal };
    } else if (tag === "select") {
      /**<select v-model="value"/> */
      attr.vModel = { tag, value: vModelVal };
    }
  }
}

/**
 * 处理v-bind指令
 * @param {*} curElement 当正在处理的AST对象
 * @param {*} bindKey v-bind:key 中的key
 * @param {*} bindValue v-bind:key = value 中的value
 */
function processVBind(curElement, bindKey, bindValue) {
  curElement.attr.vBind = { [bindKey]: bindValue };
}

/**
 * 处理v-on指令
 * @param {*} curElement  当正在处理的AST对象
 * @param {*} vOnKey v-on:key 中的key, 事件类型
 * @param {*} vOnValue  v-on:key = "value", 事件名
 */
function processVOn(curElement, vOnKey, vOnValue) {
  curElement.attr.vOn = { [vOnKey]: vOnValue };
}

/**
 *
 * @param {*} attrs 属性数组, [id = 'app', xx="xx"]
 * @returns
 */
function parseAttrs(attrs) {
  const attrMap = {};
  for (let i = 0, len = attrs.length; i < len; i++) {
    const attr = attrs[i];
    const [attrName, attrValue] = attr.split("=");
    attrMap[attrName] = attrValue.replace(/"/g, "");
  }
  return attrMap;
}

function generateAST(tagName, attrMap) {
  return {
    /**元素节点 */
    type: 1,
    /**标签 */
    tag: tagName,
    /**原始属性map对象，后续需要进一步处理 */
    rawAttr: attrMap,
    /**子节点 */
    children: [],
  };
}
