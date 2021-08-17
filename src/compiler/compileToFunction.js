import parse from "./parse";
import generate from "./generate";
/**
 * 解析模板字符串，生成ast语法树
 * 将ast语法树生成渲染函数
 * @param {*} template 模板字符串
 * @returns 渲染函数
 */
export default function compileToFunction(template) {
  /**解析模板，生成ast对象 */
  const ast = parse(template);

  console.log(ast, "ast");

  /**将ast生成渲染函数 */
  const render = generate(ast);

  return render;
}
