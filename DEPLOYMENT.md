# Cognify Deployment Guide

## Prerequisites
- Python 3.9+
- Node.js 18+
- npm

## 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
.\venv\Scripts\activate  # Windows
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
uvicorn app.main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.
Docs at `http://localhost:8000/docs`.

## 2. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies (if not already done):
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
Access the application at `http://localhost:3000`.

## 3. Usage
1. Open the web dashboard.
2. The system automatically initializes the multi-agent system.
3. Upload data or use the mock generation tools (if implemented) to see the pipeline in action.
