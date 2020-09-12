// Guard
import {Either} from "./either";

class Guard<T> {
  private failed: boolean;
  private err: string;
  
  constructor(failed: boolean, err: string) {
    this.failed = failed;
    this.err = err;
  }
  
  then(f: () => T): Either<string, T> {
    if (this.failed) {
      return {kind: "error", err: this.err};
    } else {
      return {kind: "value", val: f()};
    }
  }
};

export function guard<T>(cond: boolean, err: string): Guard<T> {
  return new Guard(!cond, err);
}