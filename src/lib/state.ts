import { Either } from "../lib/functional/either";

type Transition = () => void;

class State {
  private curr: string;
  private transitions: {[from: string]: {[to: string]: Transition} };
  
  constructor(initial: string) {
    this.curr = initial;
    this.transitions = {};
  }
  
  setTransition(from: string, to: string, transition: Transition) {
    if (!(from in this.transitions)) {
      this.transitions[from] = {};
    }
    this.transitions[from][to] = transition;
  }
  
  set(next: string): Either<string, void> {
    if (!(next in this.transitions[this.curr])) {
      return {kind: "error", err: `Cannot transition from ${this.curr} to ${next}`};
    }

    this.transitions[this.curr][next]();
  }
};

export { State, Transition }