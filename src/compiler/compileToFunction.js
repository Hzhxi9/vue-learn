import parse from "./parse";
import generate from "./generate";

export default function compileToFunction(template) {
  /**解析模板生成AST */
  const ast = parse(template);

  /**将AST生成渲染函数 */
  const render = generate(ast);

  return render;
}
