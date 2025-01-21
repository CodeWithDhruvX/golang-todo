import { createAction, props } from "@ngrx/store";
import { Task } from "../../models/task.model";


export const loadTasks = createAction('[Tasks API] Load Tasks');
export const loadTaskSuccess=createAction('[Tasks API] Load Tasks Success', props<{tasks:Task[]}>());
export const loadTasksFailure=createAction('[Tasks API] Load Tasks Failure', props<{error:string}>());

export const createTask = createAction('[Tasks API] Create Task', props<{ title: string }>());
export const createTaskSuccess = createAction('[Tasks API] Create Task Success', props<{ task: Task }>());
export const createTaskFailure = createAction('[Tasks API] Create Task Failure', props<{ error: string }>());

export const updateTask = createAction('[Tasks API] Update Task', props<{ id: number }>());
export const updateTaskSuccess = createAction('[Tasks API] Update Task Success', props<{ id: number }>());
export const updateTaskFailure = createAction('[Tasks API] Update Task Failure', props<{ error: string }>());

export const deleteTask = createAction('[Tasks API] Delete Task', props<{ id: number }>());
export const deleteTaskSuccess = createAction('[Tasks API] Delete Task Success', props<{ id: number }>());
export const deleteTaskFailure = createAction('[Tasks API] Delete Task Failure', props<{ error: string }>());
