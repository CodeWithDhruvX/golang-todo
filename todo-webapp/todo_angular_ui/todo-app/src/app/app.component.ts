import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from '../models/task.model';
import { createTask, deleteTask, loadTasks, updateTask } from '../shared/actions/tasks.actions';
import { TaskState } from '../shared/reducers/tasks.reducer';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  tasks$: Observable<Task[]>;
  todoTasks: Task[] = [];
  doneTasks: Task[] = [];
  newTaskTitle: string = '';

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

  addTask() {
    if (this.newTaskTitle.trim()) {
      this.store.dispatch(createTask({ title: this.newTaskTitle.trim() }));
      this.newTaskTitle = ''; // Reset the input field
    }
  }
  onDeleteTask(id: number): void {
    // Dispatch deleteTask action
    this.store.dispatch(deleteTask({ id }));
  }
}
