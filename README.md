# 🧠 Cognify: Autonomous Multi-Agent AI System

**Cognify** is a state-of-the-art AI platform designed to transform raw data into actionable decision intelligence. Built with a modular multi-agent architecture, it automates data ingestion, exploratory analysis, predictive modeling, and anomaly detection—providing clear, human-readable reasoning for every decision.

![Cognify Banner](frontend/public/banner.png)

---

## 🚀 Key Features

- **Hub-and-Spoke AI Architecture**: Orchestrated agents working in sync.
- **Autonomous Insights**: Auto-EDA and intelligence reporting.
- **Predictive Power**: Automated model selection (Random Forest, etc.).
- **Anomaly Detection**: Real-time risk flagging using Isolation Forest.
- **Explainable AI (XAI)**: A dedicated Reasoning Agent providing narrative logic for all results.
- **High Performance**: Optimized for low-latency execution (< 3.5s per pipeline).

---

## 🏗️ System Architecture

The system consists of specialized agents coordinated by a central Orchestrator:

1.  **Orchestrator Agent**: Manages state, workflow, and message passing.
2.  **Data Ingestion Agent**: Handles cleaning, validation, and schema mapping.
3.  **Intelligence Agent**: Conducts statistical analysis and feature correlation.
4.  **Prediction Agent**: Trains and executes machine learning models.
5.  **Anomaly Agent**: Flags outliers and potential risks in the dataset.
6.  **Reasoning Agent**: Translates mathematical output into natural language insights.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15+, TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: Python 3.9+, FastAPI, Pydantic.
- **AI/ML**: Scikit-Learn (Isolation Forest, Random Forest), LangChain, Google Gemini API.
- **Design**: Premium Glassmorphic UI with High-Fidelity animations.

---

## 🚦 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Clone the Repository
```bash
git clone https://github.com/2006-2006/cognify.git
cd cognify
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Unix/macOS
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Environment Variables
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
GEMINI_API_KEY=your_key_here
```

---

## 📖 Related Documentation

- [System Design](./SYSTEM_DESIGN.md) - Deep dive into architecture and algorithms.
- [Deployment Guide](./DEPLOYMENT.md) - Detailed production setup instructions.

---

## 🛡️ License
Distrubuted under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ by the Cognify Team.*
