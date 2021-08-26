/**
 * 从AST生成渲染函数
 * @param {*} ast
 * @returns
 */
export default function generate(ast) {
  const renderStr = genElement(ast);
  return new Function(`with(this){ return ${renderStr}}`);
}

/**
 * 解析ast生成渲染函数
 * @param {*} ast
 * @returns
 */
function genElement(ast) {
  const { tag, rawAttrs, attrs } = ast;

  /**生成属性Map对象，合并静态属性和动态属性 */
  const attrMap = { ...rawAttrs, ...attrs };

  /**处理子节点，得到一个所以子节点渲染函数组成的数组 */
  const children = genChildren(ast);

  /**生成VNode的可执行方法 */
  return `_c('${tag}', ${JSON.stringify(attrMap)}, [${children}])`;
}

/**
 * 处理ast节点的子节点，将子节点变成渲染函数
 * @param {*} ast
 * @returns
 */
function genChildren(ast) {
  const ret = [],
    { children } = ast;

  /**遍历所有子节点 */
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i];

    if (child.type === 3)
      ret.push(`_v(${JSON.stringify(child)})`) /**文本节点 */;
    else if (child.type === 1) ret.push(genElement(child)) /**元素节点 */;
  }

  return ret;
}
