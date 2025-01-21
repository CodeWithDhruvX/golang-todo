import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { Task } from "../../models/task.model"; // Correct import

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = "http://localhost:8080/tasks";
  handleError: any;

    constructor(private http: HttpClient) { }

    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl);
      }
    
      createTask(title: string): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, { title });
      }
    
      updateTask(taskId: number): Observable<any> {
        const url = `${this.apiUrl}/${taskId}`;
        return this.http.put(url, {}, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
      }
    
    
      deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }
}