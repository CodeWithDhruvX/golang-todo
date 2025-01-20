import { createReducer, on } from "@ngrx/store";
import { Task } from "../../models/task.model";
import * as TaskActions from "../actions/tasks.actions";

export interface TasksState {
    tasks: Task[];
    error: string | null;
}

const intitalState: TasksState = {
    tasks: [],
    error: null
}

export const taskReducer = createReducer(
    intitalState,
    on(TaskActions.loadTaskSuccess, (state, { tasks }) => ({
        ...state,
        tasks
    })),
    on(TaskActions.loadTasksFailure, (state, { error }) => ({
        ...state,
        error
    }))
);