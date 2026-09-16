# Stage 1: Build the React frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/yarn.lock* ./
RUN yarn install --frozen-lockfile || yarn install
COPY frontend/ .
RUN yarn build

# Stage 2: Build the Go backend
FROM golang:1.26-alpine AS backend-builder
WORKDIR /app
COPY backend/go.mod ./
COPY backend/ .
RUN go build -o main .

# Stage 3: Final lightweight image
FROM alpine:latest
WORKDIR /app

# Copy Go binary
COPY --from=backend-builder /app/main .

# Copy React static files to a folder named "dist" next to the binary
COPY --from=frontend-builder /app/dist ./dist

# Expose the single port that serves both the frontend and backend API
EXPOSE 8080

CMD ["./main"]
