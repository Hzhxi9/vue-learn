export default function renderHelper(target) {
  target._c = createElement;
  target._v = createTextNode;
}

import VNode  from "./VNode";

/**
 * 根据标签信息创建VNode
 * @param {*} tag
 * @param {*} attr
 * @param {*} children
 * @returns
 */
function createElement(tag, attr, children) {
  return VNode(tag, attr, children, this);
}

/**
 * 生成文本节点的VNode
 * @param {*} textAST
 * @returns
 */
function createTextNode(textAST) {
  return VNode(null, null, null, this, textAST);
}
