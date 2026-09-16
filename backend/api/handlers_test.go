package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCalculateHandler(t *testing.T) {
	tests := []struct {
		name         string
		method       string
		requestBody  interface{}
		expectedCode int
		expectedBody string
	}{
		{
			name:         "Valid Addition",
			method:       http.MethodPost,
			requestBody:  CalculateRequest{Operation: "add", A: 1, B: 2},
			expectedCode: http.StatusOK,
			expectedBody: `{"result":3}`,
		},
		{
			name:         "Division By Zero",
			method:       http.MethodPost,
			requestBody:  CalculateRequest{Operation: "divide", A: 10, B: 0},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"error":"division by zero"}`,
		},
		{
			name:         "Invalid Method",
			method:       http.MethodGet,
			requestBody:  nil,
			expectedCode: http.StatusMethodNotAllowed,
			expectedBody: `{"error":"method not allowed"}`,
		},
		{
			name:         "Invalid JSON",
			method:       http.MethodPost,
			requestBody:  "invalid json",
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"error":"invalid request body"}`,
		},
		{
			name:         "Unknown Operation",
			method:       http.MethodPost,
			requestBody:  CalculateRequest{Operation: "magic", A: 1, B: 2},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"error":"unknown operation"}`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var reqBytes []byte
			var err error
			if strBody, ok := tt.requestBody.(string); ok {
				reqBytes = []byte(strBody)
			} else {
				reqBytes, err = json.Marshal(tt.requestBody)
				if err != nil {
					t.Fatalf("could not marshal request body: %v", err)
				}
			}

			req, err := http.NewRequest(tt.method, "/api/calculate", bytes.NewBuffer(reqBytes))
			if err != nil {
				t.Fatalf("could not create request: %v", err)
			}

			rr := httptest.NewRecorder()
			handler := http.HandlerFunc(CalculateHandler)

			handler.ServeHTTP(rr, req)

			if status := rr.Code; status != tt.expectedCode {
				t.Errorf("handler returned wrong status code: got %v want %v", status, tt.expectedCode)
			}

			actualBody := bytes.TrimSpace(rr.Body.Bytes())
			if string(actualBody) != tt.expectedBody {
				t.Errorf("handler returned unexpected body: got %v want %v", string(actualBody), tt.expectedBody)
			}
		})
	}
}
