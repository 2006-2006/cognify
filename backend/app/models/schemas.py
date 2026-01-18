from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Union
from datetime import datetime

# --- Common ---
class BaseResponse(BaseModel):
    success: bool
    message: str

# --- Data Ingestion ---
class DataIngestionRequest(BaseModel):
    source_type: str  # 'csv', 'json', 'api', 'stream'
    source_url: Optional[str] = None
    data_payload: Optional[List[Dict[str, Any]]] = None  # For direct JSON push

class DataIngestionResponse(BaseResponse):
    data_id: str
    record_count: int
    schema_summary: Dict[str, str]

# --- Intelligence (EDA) ---
class IntelligenceRequest(BaseModel):
    data_id: str

class IntelligenceResponse(BaseResponse):
    summary_stats: Dict[str, Any]
    correlations: List[Dict[str, Any]]
    missing_values: Dict[str, int]
    insights: List[str]

# --- Prediction ---
class PredictionRequest(BaseModel):
    data_id: str
    target_column: str
    model_type: str = "auto" # auto, xgboost, lstm, rf
    prediction_horizon: int = 1

class PredictionResponse(BaseResponse):
    model_used: str
    accuracy_metrics: Dict[str, float]
    predictions: List[Dict[str, Any]]
    feature_importance: Dict[str, float]

# --- Anomaly ---
class AnomalyRequest(BaseModel):
    data_id: str
    contamination: float = 0.05

class AnomalyResponse(BaseResponse):
    anomaly_count: int
    anomalies: List[Dict[str, Any]] # indices and scores

# --- Reasoning ---
class ExplanationRequest(BaseModel):
    prediction_id: str # OR pass context
    data_context: Dict[str, Any]

class ExplanationResponse(BaseResponse):
    explanation_text: str
    shap_values: Optional[Dict[str, float]] = None

# --- Orchestrator / Full Pipeline ---
class PipelineRequest(BaseModel):
    data: Optional[List[Dict[str, Any]]] = None # Optional if data_id provided
    data_id: Optional[str] = None
    target_column: Optional[str] = None
    task_type: str = "analysis" # analysis, prediction, full_suite

class PipelineResponse(BaseResponse):
    pipeline_id: str
    steps_completed: List[str]
    results: Dict[str, Any]

class ChatRequest(BaseModel):
    data_id: str
    query: str

class ChatResponse(BaseResponse):
    reply: str
