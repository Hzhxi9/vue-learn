/**
 * 从 ast 生成渲染函数
 * @param {*} ast ast语法树
 * @returns 渲染函数
 */
export default function generate(ast) {
  /**渲染函数字符串形式 */
  const renderStr = genElement(ast);
  /**
   * 通过new Function 将字符串形式的函数变成可执行函数
   * 并用with为渲染函数扩展作用域链
   */
  return new Function(`with(this){return ${renderStr}}`);
}

/**
 * 解析 ast 生成渲染函数
 * @param {*} ast 语法树
 * @returns {String} 渲染函数的字符串形式
 */
function genElement(ast) {
  const { tagName, rawAttr, attr } = ast;

  /**生成属性Map, 静态属性 + 动态属性 */
  const attrs = { ...rawAttr, ...attr };

  /**处理子节点， 得到一个所有子节点渲染函数组成的数组 */
  const children = genChildren(ast);

  /**生成VNode的可执行方法 */
  return `_c('${tagName}', ${JSON.stringify(attrs)}, [${children}])`;
}

/**
 * 处理ast节点的子节点， 将子节点生成渲染函数
 * @param {*} ast
 * @returns [childrenRender1, ...]
 */
function genChildren(ast) {
  const ret = [],
    { children } = ast;

  /**遍历所有的子节点 */
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i];

    if (child.type === 3)
      ret.push(`_v(${JSON.stringify(child)})`) /**文本节点 */;
    else if (child.type === 1) ret.push(genElement(child)) /**元素节点 */;
  }

  return ret;
}
