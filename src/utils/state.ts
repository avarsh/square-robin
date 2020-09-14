
// TODO: In a transition, allow any number of user args
class State {
  private transitions: {[from: string]: {[to: string]: Transition} };
  states: Record<string, State>;
  name: string;
  curr: string;
  
  constructor(name: string, states: Record<string, State>) {
    this.name = name;
    this.curr = NULL_STATE_NAME;
    if (states != null) {
      states[NULL_STATE_NAME] = NULL_STATE;
    }
    this.transitions = {};
    this.states = states;
  }
  
  setTransition(from: State, to: State, transition: Transition) {
    if (!(from.name in this.transitions)) {
      this.transitions[from.name] = {};
    }
    this.transitions[from.name][to.name] = transition;
  }
  
  set(next: State): void {
    if (this.curr != null && this.curr in this.transitions && next.name in this.transitions[this.curr] && next.name != this.curr) {
      this.transitions[this.curr][next.name](this.states[next.name]);
      this.curr = next.name;
    } else if (this.curr == null) {
      console.log("Cannot transition from null state");
    } else {
      console.log(`No transition from ${this.curr} to ${next}`);
    }
  }
};

class SingleState extends State {
  constructor(name: string) {
    super(name, null);
  }
};

const NULL_STATE_NAME = "null-state";
const NULL_STATE = new SingleState(NULL_STATE_NAME);
type Transition = (next: State) => void;

export { State, SingleState, Transition, NULL_STATE }