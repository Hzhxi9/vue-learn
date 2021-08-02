
import Observer from './Observer'

export default function observe(value) {
  if (typeof value !== "object") return;

  if (value.__ob__) return value;

  return new Observer(value);
}
