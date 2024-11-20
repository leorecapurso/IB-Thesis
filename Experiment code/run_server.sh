#!/bin/bash

# Define the project directory (change this to your actual project path)
PROJECT_DIR=$(dirname "$(realpath "$0")")

# Activate virtual environment if it exists
if [ -d "$PROJECT_DIR/venv" ]; then
  echo "Activating virtual environment..."
  source "$PROJECT_DIR/venv/bin/activate"
else
  echo "Virtual environment not found. Creating a new one..."
  python3 -m venv "$PROJECT_DIR/venv"
  source "$PROJECT_DIR/venv/bin/activate"
  echo "Installing Flask..."
  pip install flask
fi

# Navigate to the project directory
cd "$PROJECT_DIR"

# Start the Flask server
echo "Starting Flask server..."
python3 log_data.py
