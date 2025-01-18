package main

import (
	"database/sql"  // package for sql database
	"encoding/json" // package for encoding and decoding JSON
	"fmt"           // package for formatting I/O
	"log"           // package for logging
	"net/http"      // package for http server and client
	"os"            // package to get environment variable

	"github.com/gorilla/mux" // package for http router and URL matcher
	_ "github.com/lib/pq"    // package for postgres driver
)

type Task struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
}

func main() {
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
	// router.HandleFunc("/tasks",createTask).Methods("PUT")
	// router.HandleFunc("/tasks",deleteTask).Methods("DELETE")

	// start the server
	http.ListenAndServe(":8080", router)
	log.Fatal(http.ListenAndServe(":8080", router))
}

func getConnStr() string {
	dbUser := "postgres"
	dbPassword := os.Getenv("POSTGRES_PASSWORD") // get password from environment variable
	dbName := "todo_app"
	dbHost := "localhost" // default host
	dbPort := "5432"      // default port for postgres

	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", dbHost, dbPort, dbUser, dbPassword, dbName)
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
