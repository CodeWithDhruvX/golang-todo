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
        ...state
    })),
    on(TaskActions.loadTasksFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(TaskActions.createTaskSuccess, (state, { task }) => ({
        ...state,
        tasks: [...state.tasks, task]
    })),
    on(TaskActions.createTaskFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(TaskActions.updateTaskSuccess, (state, { id }) => ({
        ...state,
        tasks: state.tasks.map(task => (task.id === id) ? { ...task, done: !task.done } : task)
    })),
    on(TaskActions.updateTaskFailure, (state, { error }) => ({
        ...state,
        error
    })),
    on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
        ...state,
        tasks: state.tasks.filter(task=>task.id!==id)
    })),
    on(TaskActions.deleteTaskFailure, (state, { error }) => ({
        ...state,
        error
    }))

);