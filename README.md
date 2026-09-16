# Sezzle Calculator

A full-stack calculator application built with a Go (net/http) backend and a React + TypeScript frontend (Vite).

## Design Decisions

- **Decoupled Architecture (mostly):** The frontend and backend are kept in separate directories and can be run independently during development for a quick iteration cycle (using Vite's proxy for API requests).
- **Single Container Deployment:** For simplicity and ease of deployment, the application is shipped as a single Docker container. The Go backend serves the compiled React static files along with handling the `/api/calculate` routes. This approach minimizes moving parts for a simple application.
- **RESTful API:** The backend exposes a straightforward POST endpoint (`/api/calculate`) that processes calculation requests and handles errors gracefully (e.g., Division by Zero).
- **Testing:** Comprehensive unit tests exist for both the Go backend (using Go's standard `testing` framework) and the React frontend (using Vitest and React Testing Library).

## Prerequisites
- Docker (for containerized setup)
- Node.js & Yarn (for local frontend dev)
- Go 1.22+ (for local backend dev)

## Running the Application

### 1. Using Docker (Recommended)

Build and run the application in a single command using Docker:

```bash
docker build -t sezzle-calculator .
docker run -p 8080:8080 sezzle-calculator
```

Open your browser and navigate to `http://localhost:8080`.

### 2. Manual Setup (Development Mode)

If you want to run the frontend and backend separately with hot-reloading:

**Terminal 1 (Backend):**
```bash
cd backend
go run main.go
```
The backend will run on `http://localhost:8080`.

**Terminal 2 (Frontend):**
```bash
cd frontend
yarn install
yarn dev
```
The frontend will start on a Vite dev server port (e.g., `http://localhost:5173`) and proxy API requests to the Go backend.

## Running Tests

**Backend (Go):**
```bash
cd backend
go test ./... -v
```

**Frontend (React):**
```bash
cd frontend
yarn test
```

## API Examples

The backend accepts `POST` requests at `/api/calculate`.

**Addition:**
```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation": "add", "a": 10, "b": 5}'
```
*Response:* `{"result": 15}`

**Division by Zero:**
```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation": "divide", "a": 10, "b": 0}'
```
*Response (400 Bad Request):* `{"error": "division by zero"}`
