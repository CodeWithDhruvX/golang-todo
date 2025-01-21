import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from '../models/task.model';
import { loadTasks, updateTask } from '../shared/actions/tasks.actions';
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

  onDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const updatedTask = { ...task, done: !task.done };

      // Dispatch updateTask action to update the task's status
      this.store.dispatch(updateTask({ id: updatedTask.id }));

      // Transfer the task between lists
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
