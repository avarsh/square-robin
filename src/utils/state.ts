import { Either } from "./functional/either";

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
  
  set(next: string): void {
    if (next in this.transitions[this.curr]) {
      this.transitions[this.curr][next]();
      this.curr = next;
    } else {
      console.log(`No transition from ${this.curr} to ${next}`);
    }
  }
};

export { State, Transition }