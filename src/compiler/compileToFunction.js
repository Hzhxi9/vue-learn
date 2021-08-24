import parse from "./parse";
import generate from "./generate";

export default function compileToFunction(template) {
  const ast = parse(template);

  const render = generate(ast);

  console.log(render);
  return render;
}
