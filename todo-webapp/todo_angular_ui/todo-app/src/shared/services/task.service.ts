import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Task } from "zone.js/lib/zone-impl";


@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = "http:localhost:8080/tasks";

    constructor(private http: HttpClient) { }

    getTasks() : Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl);
    }

}