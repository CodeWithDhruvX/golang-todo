import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TaskService } from "../services/task.service";
import { catchError, map, mergeMap, of } from "rxjs";
import * as TaskActions from "../actions/tasks.actions";

@Injectable()
export class TasksEffects {

    constructor(private actions$: Actions, private taskService: TaskService) { }

    loadTasks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TaskActions.loadTasks),
            mergeMap(() =>
                this.taskService.getTasks().pipe(
                    map(tasks => TaskActions.loadTaskSuccess({ tasks })),
                    catchError(error => of(TaskActions.loadTasksFailure({ error }))
                    ))
            )
        ));


    createTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TaskActions.createTask),
            mergeMap(action =>
                this.taskService.createTask(action.title).pipe(
                    map(task => TaskActions.createTaskSuccess({ task })),
                    catchError(error => of(TaskActions.createTaskFailure({ error }))
                    ))
            )
        ));

    updateTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TaskActions.updateTask),
            mergeMap(action =>
                this.taskService.updateTask(action.id).pipe(
                    map(() => TaskActions.updateTaskSuccess({ id: action.id })),
                    catchError(error => of(TaskActions.updateTaskFailure({ error }))
                    ))
            )
        ));

    deleteTask$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TaskActions.deleteTask),
            mergeMap(action =>
                this.taskService.deleteTask(action.id).pipe(
                    map(() => TaskActions.deleteTaskSuccess({ id: action.id })),
                    catchError(error => of(TaskActions.deleteTaskFailure({ error }))
                    ))
            )
        ));

}