import { State, SingleState } from "../../utils/state";

const emptyState: State = new SingleState("empty");
const listState:  State = new SingleState("list");

const states: Record<string, State> = {};
states[emptyState.name] = emptyState;
states[listState.name]  = listState;

export { states, emptyState, listState }