export default function VNode(tag, attr, children, context, text = null) {
  return {
    tag,
    attr,
    parent: null,
    children,
    text,
    elm: null,
    context,
  };
}
