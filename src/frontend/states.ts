import { State } from "../utils/state";
import * as toTasks from "./tasks/transitions"
import * as toDaily from "./daily/transitions";

const nullView:  string = "null-view"
const tasksView: string = "tasks-view"
const dailyView: string = "daily-view"

const view: State = new State(nullView);

view.setTransition(nullView, tasksView, toTasks.fromNull);
view.setTransition(nullView, dailyView, toDaily.fromNull);
view.setTransition(tasksView, dailyView, toTasks.fromDaily);
view.setTransition(dailyView, tasksView, toDaily.fromTasks);

export { view, nullView, tasksView, dailyView };