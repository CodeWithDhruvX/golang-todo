import { createReducer, on } from "@ngrx/store";
import { Task } from "../../models/task.model";
import * as TaskActions from "../actions/tasks.actions";

export interface TaskState {
    tasks: Task[];
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    error: null
}

export const taskReducer = createReducer(
    initialState,
    on(TaskActions.loadTaskSuccess, (state, { tasks }) => ({
        ...state,
        tasks
    })),
    on(TaskActions.loadTasksFailure, (state, { error }) => ({
        ...state,
        error
    }))
);