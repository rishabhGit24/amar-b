# AMAR MVP Development Makefile

.PHONY: help setup install test clean run-backend run-frontend build

help:
	@echo "AMAR MVP Development Commands"
	@echo "============================"
	@echo "setup          - Initial project setup"
	@echo "install        - Install all dependencies"
	@echo "test           - Run all tests"
	@echo "run-backend    - Start backend server"
	@echo "run-frontend   - Start frontend server"
	@echo "build          - Build frontend for production"
	@echo "clean          - Clean build artifacts"

setup:
	@echo "🚀 Setting up AMAR MVP..."
	python setup.py

install:
	@echo "📦 Installing dependencies..."
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

test:
	@echo "🧪 Running tests..."
	python scripts/run_tests.py

run-backend:
	@echo "🐍 Starting backend server..."
	python scripts/start_backend.py

run-frontend:
	@echo "⚛️  Starting frontend server..."
	cd frontend && npm start

build:
	@echo "🏗️  Building frontend..."
	cd frontend && npm run build

clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf frontend/build/
	rm -rf frontend/node_modules/
	find backend -name "__pycache__" -type d -exec rm -rf {} +
	find backend -name "*.pyc" -delete