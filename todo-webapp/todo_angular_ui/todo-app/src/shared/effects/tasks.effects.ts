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

}