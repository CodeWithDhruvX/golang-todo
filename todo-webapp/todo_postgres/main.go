package main

import (
	"database/sql"  // package for sql database
	"encoding/json" // package for encoding and decoding JSON
	"fmt"           // package for formatting I/O
	"log"           // package for logging
	"net/http"      // package for http server and client
	"os"
	"strconv"

	"github.com/gorilla/handlers" // package for CORS
	"github.com/gorilla/mux"      // package for http router and URL matcher
	"github.com/joho/godotenv"    // package to read .env file
	_ "github.com/lib/pq"         // package for postgres driver,
)

type Task struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
}

func main() {

	// Load the .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// connect to the database
	connStr := getConnStr()
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}

	defer db.Close()
	fmt.Println("Successfully connected to database")

	// router setup
	router := mux.NewRouter()
	router.HandleFunc("/tasks", getTasks).Methods("GET")
	router.HandleFunc("/tasks", createTask).Methods("POST")
	router.HandleFunc("/tasks/{id}", updateTask).Methods("PUT")
	router.HandleFunc("/tasks/{id}", deleteTask).Methods("DELETE")

	//  CORS setup
	corsHandlers := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:4200"}),                   // allow only this origin
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}), // allow only these methods
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(router)

	// start the server
	http.ListenAndServe(":8080", corsHandlers)
	log.Fatal(http.ListenAndServe(":8080", router))
}

func getConnStr() string {
	dbUser := os.Getenv("POSTGRES_USER")         // get user from environment variable
	dbPassword := os.Getenv("POSTGRES_PASSWORD") // get password from environment variable
	dbName := os.Getenv("POSTGRES_DB")           // get database name from environment variable
	dbHost := os.Getenv("POSTGRES_HOST")         // default host
	dbPort := os.Getenv("POSTGRES_PORT")         // default port for postgres

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", dbHost, dbPort, dbUser, dbPassword, dbName)
	return connStr
}

// func connectToDatabase() (*sql.DB,error) {
// 	connStr:=getConnStr()
// 	return sql.open("postgres",connStr)
// }

func callStoredProcedure(query string, args ...interface{}) (*sql.Rows, error) {
	connStr := getConnStr()
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	return db.Query(query, args...)
}

// getTasks function to fetch all tasks

func getTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	rows, err := callStoredProcedure("SELECT * FROM fetch_all_tasks()")

	if err != nil {
		fmt.Println("Error fetching tasks:", err)
		http.Error(w, "Failed to fecth tasks", http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var task Task
		if err := rows.Scan(&task.ID, &task.Title, &task.Done); err != nil {
			http.Error(w, "Failed to scan tasks", http.StatusInternalServerError) // 500 status code
			return
		}

		tasks = append(tasks, task)
	}

	json.NewEncoder(w).Encode(tasks)

}

func getDBConnection() (*sql.DB, error) {
	connStr := getConnStr()
	return sql.Open("postgres", connStr)
}

// createTask function to create a new task
func createTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var task Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest) // 400 status code
		return
	}

	db, err := getDBConnection()
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError) // 500 status code
		return
	}

	err = db.QueryRow("SELECT create_task($1)", task.Title).Scan(&task.ID)
	if err != nil {
		http.Error(w, "Failed to create task", http.StatusInternalServerError) // 500 status code
		return
	}

	task.Done = false
	json.NewEncoder(w).Encode(task)

}

// updateTask: Mark Task as Done
func updateTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	db, err := getDBConnection()
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError) // 500 status code
		return
	}

	var result bool
	err = db.QueryRow("SELECT mark_task_done($1)", id).Scan(&result)

	if err != nil || !result {
		http.Error(w, "Task Not Found", http.StatusNotFound) // 404 not found
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := map[string]string{
		"message": "task updated!",
	}

	json.NewEncoder(w).Encode(response)
}

// delete task : TODO APP
func deleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	db, err := getDBConnection()
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError) // 500 status code
		return
	}

	var result bool
	err = db.QueryRow("SELECT delete_tasks($1)", id).Scan(&result)

	if err != nil || !result {
		http.Error(w, "Task Not Found", http.StatusNotFound) // 404 not found
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := map[string]string{
		"message": "delete successfully!",
	}

	json.NewEncoder(w).Encode(response)

}

// func corsMiddleWare(next http.HandlerFunc) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		w.Header().Set("Access-Control-Allow-Origin", "*")                 // allow all origins and local development
// 		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS") // allow all methods
// 		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")     // allow headers

// 		if r.Method == "OPTIONS" { // preflight request
// 			w.WriteHeader(http.StatusOK)
// 			return
// 		}

// 		next(w, r)
// 	}
// }
