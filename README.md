# 🧮 Sezzle Full-Stack Calculator

A modern, containerized full-stack calculator application engineered with a **React (TypeScript)** frontend and a high-performance **Go** backend. 

This project is meticulously designed around a **Single-Container Architecture** to eliminate "it works on my machine" issues. By leveraging Docker multi-stage builds, the entire application (both the API and the UI) is compiled, bundled, and served through a single unified lightweight container.

---

## 🏗️ Architecture & Design Decisions

- **Unified Deployment (Docker):** The application utilizes a multi-stage Dockerfile. It independently compiles the React Vite frontend and the Go backend, then combines the optimized artifacts into a single minimal Alpine Linux container. This reduces the deployment footprint and simplifies hosting.
- **Go Backend (net/http):** A lightweight, zero-dependency RESTful API. The Go server handles complex arithmetic validation (e.g., catching Division by Zero) and gracefully serves the static frontend assets from the same port, avoiding CORS complexities.
- **React + Vite Frontend:** A highly responsive, grid-based calculator UI built with TypeScript for strict type safety. It uses standard `fetch` to communicate seamlessly with the backend API.
- **Robust Error Handling:** Edge cases are handled gracefully. The UI clearly communicates errors propagated by the backend (like invalid operations or division by zero) without crashing.

---

## 🚀 Getting Started

To ensure a pristine and identical environment regardless of your operating system, this project is exclusively designed to be run via **Docker**. No local Node.js or Go installations are required!

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed and running on your machine.

### 1. Build the Application
Open your terminal in the root directory of this repository and run the following command to build the image:

```bash
docker build -t sezzle-calculator .
```
*(This process securely fetches the necessary Go and Node environments, compiles both codebases in isolation, and packages the final application.)*

### 2. Run the Container
Once the build is complete, launch the container and map the internal port to your host machine:

```bash
docker run -p 8080:8080 sezzle-calculator
```

### 3. Use the Application
Open your favorite web browser and navigate to:
👉 **[http://localhost:8080](http://localhost:8080)**

You will instantly see the calculator interface. All calculations you perform are routed dynamically to the Go backend API running within the exact same container!

---

## 📡 API Reference

For testing or integration purposes, you can also interact directly with the backend REST API while the Docker container is running.

**Endpoint:** `POST /api/calculate`  
**Headers:** `Content-Type: application/json`

### Success Example (Multiplication)
**Request:**
```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation": "multiply", "a": 5, "b": 4}'
```
**Response (200 OK):**
```json
{
  "result": 20
}
```

### Error Example (Division by Zero)
**Request:**
```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation": "divide", "a": 10, "b": 0}'
```
**Response (400 Bad Request):**
```json
{
  "error": "division by zero"
}
```

---

## 🧪 Testing

The codebase includes comprehensive unit tests for both the Go backend (`testing` package) and the React frontend (Vitest + React Testing Library). These ensure mathematical integrity and component reliability at the source level before containerization.
