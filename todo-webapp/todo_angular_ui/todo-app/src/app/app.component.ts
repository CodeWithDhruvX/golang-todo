import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { loadTasks } from '../shared/actions/tasks.actions';
import { Task } from '../models/task.model';
import { TaskState } from '../shared/reducers/tasks.reducer';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'todo-app';
  todoTasks: Task[] = [];
  doneTasks: Task[] = [];
  tasks$:Observable<Task[]>

  constructor(private store:Store<{tasks:TaskState}>){
    this.tasks$=this.store.select(state=>state.tasks.tasks)
  }

  ngOnInit(){
    this.store.dispatch(loadTasks());
    this.tasks$.subscribe(tasks => {
      console.log(tasks);
      this.todoTasks = tasks.filter(task => !task.done);
      this.doneTasks = tasks.filter(task => task.done);
    });
  }
}
