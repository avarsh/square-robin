import { State, Transition } from "../lib/state";
import * as toFirstRun from "../components/first-run/transitions";

const nullView: string = "null-view"
const firstRun: string = "first-run"
const taskView: string = "task-view"

const view: State = new State(nullView);

view.setTransition(nullView, firstRun, toFirstRun.fromNull);

export { view, nullView, firstRun, taskView };