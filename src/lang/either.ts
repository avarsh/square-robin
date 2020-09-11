// Module which provides Either

type Either<E, V> = 
  | { kind: "error"; err: E }
  | { kind: "value"; val: V };

export function isErr<E, V>(either: Either<E, V>): boolean {
  return either.kind === "error";
}

export function isVal<E, V>(either: Either<E, V>): boolean {
  return either.kind === "value";
}

export function either<E, V, C>(
    errCase: ((e: E) => C), 
    valCase: ((v: V) => C), 
    either: Either<E, V>): C {
  if (either.kind === "error") {
    return errCase(either.err);
  } else {
    return valCase(either.val);
  }
}

export function fromErr<E, V>(def: E, either: Either<E, V>): E {
  if (either.kind === "error") {
    return either.err;
  } else {
    return def;
  }
}

export function fromVal<E, V>(def: V, either: Either<E, V>): V {
  if (either.kind === "value") {
    return either.val;
  } else {
    return def;
  }
}

export {Either};