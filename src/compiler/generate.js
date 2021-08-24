export default function generate(ast) {
  console.log(ast, "==ast");

  const renderStr = genElement(ast);

  return new Function(`with(this){return ${renderStr}}`);
}

function genElement(ast) {
  const { tag, rawAttr, attr } = ast;

  const attrs = { ...rawAttr, ...attr };

  const children = genChildren(ast);

  return `_c('${tag}', ${JSON.stringify(attrs)}, [${children}])`;
}

function genChildren(ast) {
  const ret = [],
    { children } = ast;

  for (let i = 0, len = children.length; i < len; i++) {
    const ch = children[i];
    if (ch.type === 3) {
      ret.push(`_v(${JSON.stringify(ch)})`);
    } else {
      ret.push(genElement(ch));
    }
  }

  return ret;
}
