package main

import (
	"log"
	"net/http"
	"calculator-backend/api"
)

func main() {
	http.HandleFunc("/api/calculate", api.CalculateHandler)

	log.Println("Server listening on port 8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
