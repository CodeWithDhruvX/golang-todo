package main

import (
	// "bufio"
	"fmt"
	// "os"
	// "strings"
	"github.com/gorilla/mux" // http router and URL matcher 
	"log"
	"net/http" // provides tool for creating HTTP servers and clients.
	"encoding/json" // handling the JSON in web APIS
	"strconv" // convert string to integer
)

// Task represents a single todo item
type Task struct {
	ID int
	Title string
	Done bool
}

var tasks []Task
var taskID int = 1

func main(){

	// set up the router
	r:=mux.NewRouter()

	// API routes setup
	r.HandleFunc("/tasks",getTasks).Methods("GET")
	r.HandleFunc("/tasks",createTask).Methods("POST")
	r.HandleFunc("/tasks/{id:[0-9]+}",updateTask).Methods("PUT")
	r.HandleFunc("/tasks/{id:[0-9]+}",deleteTask).Methods("DELETE")




	//  create a new scanner object
	// scanner:= bufio.NewScanner(os.Stdin)
	// fmt.Println("simple TODO App")
	// fmt.Println("---------------")
	
	
	fmt.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080",r))


	
	// cli toado app
	// showHelp()

	// for {
	// 	fmt.Println("\n Enter command:")
	// 	scanner.Scan()
	// 	input:=strings.TrimSpace(scanner.Text())
	
	
	// 	switch input {
	// 	case "add":
	// 		addTask(scanner)
	// 	case "list":
	// 		listTasks()
	// 	case "done":
	// 		markTaskDone(scanner)
	// 	case "delete":
	// 		deleteTask(scanner)
	// 	case "help":
	// 		showHelp()
	// 	case "exit":
	// 		fmt.Println("Exiting TODO App. Bye!")
	// 		return
	// 	default:
	// 		fmt.Println("Invalid command. Type 'help' for options")						
	// 	}
	// }
}


// GET all tasks
func getTasks(w http.ResponseWriter,r *http.Request){
	w.Header().Set("Content-type","application/json")
	json.NewEncoder(w).Encode(tasks)
}

//  create a new task by API
func createTask(w http.ResponseWriter,r *http.Request){
	w.Header().Set("Content-type","application/json")

	var task Task
	if err:=json.NewDecoder(r.Body).Decode(&task); err!=nil {
		http.Error(w,"Invalid request payload!",http.StatusBadRequest)
		return
	}

	if task.Title == "" {
		http.Error(w,"Task title cannot be empty",http.StatusBadRequest)
		return
	}


	task.ID=taskID
	taskID++

	tasks=append(tasks,task)

	json.NewEncoder(w).Encode(task) // streaming the large JSON response
}

// update a task by status using API
func updateTask(w http.ResponseWriter,r *http.Request){
	// set the response header to indicate the JSON response
	w.Header().Set("Content-type","application/json")

	// extract the route variables form the request using gorilla mux
	vars:=mux.Vars(r)
	id,_:=strconv.Atoi(vars["id"]) //convert id from string to integer

	// iterate over the tasks to find the task with the given id
	for i,task:=range tasks {
		if task.ID == id{
			//  mark task as done
			tasks[i].Done=true

			// encode the updated task as JSON and send it as response
			json.NewEncoder(w).Encode(tasks[i])
			return
		}
	}

	//  if the task is not found, return a 404 response
	http.Error(w,"Task not found",http.StatusNotFound)

}

func deleteTask(w http.ResponseWriter,r *http.Request){
	// set the response header to indicate the JSON response
	w.Header().Set("Content-type","application/json")

	// extract the route variables form the request using gorilla mux
	vars:=mux.Vars(r)
	id,_:=strconv.Atoi(vars["id"]) //convert id from string to integer


	// iterate over the tasks to find the task with the given id
	for i,task:=range tasks {
		if task.ID == id{
			// remove the task from the slice
			tasks=append(tasks[:i],tasks[i+1:]...)

			// send the 204 No Content Response to indicate the task was deleted
			w.WriteHeader(http.StatusNoContent)
			return
		}
	}

	//  if the task is not found, return a 404 response
	http.Error(w,"Task not found",http.StatusNotFound)

}

// func showHelp(){
// 	fmt.Println("Available commands:")
// 	fmt.Println("add: Add a new task")
// 	fmt.Println("list: List all tasks")
// 	fmt.Println("done: Mark a task as done")
// 	fmt.Println("delete: Delete a task")
// 	fmt.Println("help: Show available commands")
// 	fmt.Println("exit: Exit the application")
// }


