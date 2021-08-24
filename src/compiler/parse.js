export default function parse(template) {
  const stack = [];

  let root = null;

  let html = template;

  while (html.trim()) {
    if (html.indexOf("<!--") === 0) {
      html = html.slice(html.indexOf("-->") + 3);
      continue;
    }

    const startIdx = html.indexOf("<");

    if (startIdx === 0) {
      if (html.indexOf("</") === 0) {
        parseEnd();
      } else {
        parseStartTag();
      }
    } else if (startIdx > 0) {
      const nextStartIdx = html.indexOf("<");

      if (stack.length) processChars(html.slice(0, nextStartIdx));

      html = html.slice(nextStartIdx);
    } else {
      //
    }
  }

  return root;

  function parseEnd() {
    html = html.slice(html.indexOf(">") + 1);
    processElement();
  }

  function parseStartTag() {
    const end = html.indexOf(">");

    const content = html.slice(1, end);

    html = html.slice(end + 1);

    const firstSpaceIdx = content.indexOf(" ");

    let tagName = "",
      attrsStr = "";

    if (firstSpaceIdx === -1) {
      tagName = content;
      attrsStr = "";
    } else {
      tagName = content.slice(0, firstSpaceIdx);
      attrsStr = content.slice(firstSpaceIdx + 1);
    }

    const attrs = attrsStr ? attrsStr.split(" ") : [];

    const attrsMap = parseAttrs(attrs);

    const elementAST = generateAST(tagName, attrsMap);

    console.log(elementAST, "===");

    if (!root) root = elementAST;

    stack.push(elementAST);

    if (isUnary(tagName)) processElement();
  }

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

  function processElement() {
    const curEle = stack.pop();

    const stackLen = stack.length;

    const { tag, rawAttr } = curEle;

    curEle.attr = {};

    const propertyArr = Object.keys(rawAttr);

    if (propertyArr.includes("v-model")) processVModel(curEle);
    else if (propertyArr.find(property => property.match(/^v-bind:(.*)/)))
      processVBind(curEle, RegExp.$1, rawAttr[`v-bind:${RegExp.$1}`]);
    else if (propertyArr.find(property => property.match(/^v-on:(.*)/)))
      processVOn(curEle, RegExp.$1, rawAttr[`v-on:${RegExp.$1}`]);

    if (stackLen) {
      stack[stackLen - 1].children.push(curEle);
      curEle.parent = stack[stackLen - 1];
    }
  }
}

function processVModel(curEle) {
  const { tag, rawAttr, attr } = curEle;
  const { type, "v-model": vModelValue } = rawAttr;

  if (tag === "input") {
    if (/text/.test(type))
      attr.vModel = { tag, type: "text", value: vModelValue };
    else if (/checkbox/.test(type))
      attr.vModel = { tag, type: "checkbox", value: vModelValue };
  } else if (tag === "textarea") {
    attr.vModel = { tag, value: vModelValue };
  } else if (tag === "select") {
    attr.vModel = { tag, value: vModelValue };
  }
}

function processVBind(curEle, bindKey, bindVal) {
  curEle.attr.vBind = { [bindKey]: bindVal };
}

function processVOn(curEle, vOnKey, vOnVal) {
  curEle.attr.on = { [vOnKey]: vOnVal };
}

function parseAttrs(attrs) {
  const attrMap = {};
  for (let i = 0, len = attrs.length; i < len; i++) {
    const attr = attrs[i];
    const [attrName, attrValue] = attr.split("=");
    attrMap[attrName] = attrValue.replace(/"/g, "");
  }
  return attrMap;
}

function generateAST(tagName, attrsMap) {
  return {
    type: 1,
    tag: tagName,
    rawAttr: attrsMap,
    children: [],
  };
}

function isUnary(tagName) {
  const unaryTag = ["input"];
  return unaryTag.includes(tagName);
}
