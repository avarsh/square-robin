import { State, SingleState, NULL_STATE } from "../utils/state";
import * as toTasks from "./tasks/transitions"
import * as tasks from "./tasks/states";
import * as $ from "jquery";

const tasksView: State = new State("tasks-view", tasks.states);
tasksView.setTransition(NULL_STATE, tasks.emptyState, (empty: State) => { $("#tasks-view .empty-list").show(); });
tasksView.setTransition(NULL_STATE, tasks.listState,  (list: State) => { $("#tasks-view .task-list").show(); });
tasksView.setTransition(tasks.emptyState, tasks.listState, (list: State) => {});
tasksView.setTransition(tasks.listState, tasks.emptyState, (empty: State) => {});

const viewStates: Record<string, State> = {};
viewStates[tasksView.name] = tasksView;
const view: State = new State("view", viewStates);

view.setTransition(NULL_STATE, tasksView, toTasks.fromNull);

export { viewStates, view, tasksView };