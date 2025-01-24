import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { createTask, deleteTask, loadTasks, updateTask } from '../shared/actions/tasks.actions';
import { TasksState } from '../shared/reducers/tasks.reducer';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone:false
})
export class AppComponent {
  title = 'todo-app'
  tasks$:Observable<Task[]>;
  newTaskTitle:string='';
  todoTasks: Task[]=[];
  doneTasks: Task[]=[];

  constructor(private store:Store<{task:TasksState}>){
    this.tasks$=this.store.select(state=>state.task.tasks);
  }

  ngOnInit(){
    this.store.dispatch(loadTasks());
    this.tasks$.subscribe(data=>{
      console.log(data);
      this.todoTasks=data.filter(task=>!task.done);
      this.doneTasks=data.filter(task=>task.done);
    });
  }


  // add task
  addTask(){
    if(this.newTaskTitle.trim()===''){
      return;
    }

    this.store.dispatch(createTask({title:this.newTaskTitle}));
    this.newTaskTitle='';
  }

  // delete task
  onDeleteTask(id:number){
    this.store.dispatch(deleteTask({id:id}));
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      const task=event.previousContainer.data[event.previousIndex];
      const updatedTask={...task,done:!task.done};


      // dispatch update task action to the update task status
      this.store.dispatch(updateTask({id:updatedTask.id}));

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);


    }
  }
}
