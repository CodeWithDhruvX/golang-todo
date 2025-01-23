import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TasksState } from '../shared/reducers/tasks.reducer';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { loadTasks } from '../shared/actions/tasks.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone:false
})
export class AppComponent {
  title = 'todo-app'
  tasks$:Observable<Task[]>;

  constructor(private store:Store<{task:TasksState}>){
    this.tasks$=this.store.select(state=>state.task.tasks);
  }

  ngOnInit(){
    this.store.dispatch(loadTasks());
    this.tasks$.subscribe(data=>console.log(data));
  }
}
