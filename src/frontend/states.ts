import { State, SingleState, NULL_STATE } from "../utils/state";
import * as toTasks from "./tasks/transitions"
import * as tasks from "./tasks/states";
import * as daily from "./daily/states";
import * as toDaily from "./daily/transitions"
import * as $ from "jquery";

const tasksView: State = new State("tasks-view", tasks.states);
tasksView.setTransition(NULL_STATE, tasks.emptyState, toTasks.nullToEmpty);
tasksView.setTransition(NULL_STATE, tasks.listState,  toTasks.nullToList);
tasksView.setTransition(tasks.emptyState, tasks.listState, toTasks.emptyToList);
tasksView.setTransition(tasks.listState, tasks.emptyState, toTasks.listToEmpty);
tasksView.setTransition(tasks.listState, tasks.listState, toTasks.listToList);

const dailyView: State = new State("daily-view", daily.states);
dailyView.setTransition(NULL_STATE, daily.emptyState, (empty: State) => {});
dailyView.setTransition(NULL_STATE, daily.listState, (empty: State) => {});
dailyView.setTransition(daily.emptyState, daily.listState, (empty: State) => {});
dailyView.setTransition(daily.listState, daily.emptyState, (empty: State) => {});

const viewStates: Record<string, State> = {};
viewStates[tasksView.name] = tasksView;
viewStates[dailyView.name] = dailyView;
const view: State = new State("view", viewStates);

view.setTransition(NULL_STATE, tasksView, toTasks.fromNull);
view.setTransition(NULL_STATE, dailyView, toDaily.fromNull);

view.setTransition(dailyView, tasksView, toTasks.fromDaily);
view.setTransition(tasksView, dailyView, toDaily.fromTasks);

export { viewStates, view, tasksView, dailyView };