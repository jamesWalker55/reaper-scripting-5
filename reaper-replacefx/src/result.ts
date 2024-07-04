export function Ok<T>(x: T) {
  type Ok<T> = { readonly val: T; readonly ok: true };
  const result: Ok<T> = { val: x, ok: true };
  return result;
}

export function newErr<const T>(msg: T) {
  type Err<T> = { readonly name: T; readonly ok: false };
  const result: Err<T> = { name: msg, ok: false };
  return result;
}
