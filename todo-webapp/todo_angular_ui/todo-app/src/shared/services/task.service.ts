import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Task } from "../../models/task.model"; // Correct import

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = "http://localhost:8080/tasks";

    constructor(private http: HttpClient) { }

    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl);
      }
    
      createTask(title: string): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, { title });
      }
    
      updateTask(id: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, {});
      }
    
      deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }
}