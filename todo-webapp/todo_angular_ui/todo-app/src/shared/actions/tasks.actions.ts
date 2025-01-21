import { createAction, props } from "@ngrx/store";
import { Task } from "../../models/task.model";


export const loadTasks = createAction('[Tasks API] Load Tasks');
export const loadTaskSuccess=createAction('[Tasks API] Load Tasks Success', props<{tasks:Task[]}>());
export const loadTasksFailure=createAction('[Tasks API] Load Tasks Failure', props<{error:string}>());
