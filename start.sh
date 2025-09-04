#!/bin/bash

# Function to check if a process is already running
is_running() {
  pgrep -f "$1" > /dev/null
}

# Start the backend in the background
echo "Starting backend..."
cd backend
if is_running "ts-node-dev src/server.ts"; then
    echo "Backend is already running. Skipping start."
else
    npm run dev &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
fi
cd ..

# Start the frontend in the background
echo "Starting frontend..."
cd frontend
if is_running "vite"; then
    echo "Frontend is already running. Skipping start."
else
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
fi
cd ..

echo "Both backend and frontend are running. Press [Ctrl+C] to stop both."

# Wait for background jobs to finish
wait