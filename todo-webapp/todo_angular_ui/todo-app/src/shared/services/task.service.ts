import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Task } from "../../models/task.model";



@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = "http://localhost:8080/tasks";

    constructor(private http: HttpClient) { }

    getTasks() : Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl);
    }

    createTask(title:string) :Observable<Task>{
        return this.http.post<Task>(this.apiUrl,{title});
    }

    updateTask(taskId:number):Observable<any>{
        return this.http.put<void>(`${this.apiUrl}/${taskId}`,{});
    }

    deleteTask(taskId:number):Observable<any>{
        return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
    }

}