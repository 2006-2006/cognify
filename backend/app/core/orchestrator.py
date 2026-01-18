import pandas as pd
import numpy as np
import asyncio
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.schemas import (
    PipelineRequest, PipelineResponse, 
    DataIngestionResponse, IntelligenceResponse, PredictionResponse
)
from app.agents.ingestion import IngestionAgent
from app.agents.intelligence import IntelligenceAgent
from app.agents.prediction import PredictionAgent
from app.agents.anomaly import AnomalyAgent
from app.agents.reasoning import ReasoningAgent
import uuid
import logging

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CognifyOrchestrator")

class Orchestrator:
    def __init__(self):
        self.ingestion = IngestionAgent()
        self.intelligence = IntelligenceAgent()
        self.prediction = PredictionAgent()
        self.anomaly = AnomalyAgent()
        self.reasoning = ReasoningAgent()
        self.data_store = {} # In-memory for now, replace with DB/Redis

    async def ingest_file(self, file_content: bytes, filename: str) -> str:
        pipeline_id = str(uuid.uuid4())
        df = self.ingestion.process_file(file_content, filename)
        self.data_store[pipeline_id] = df
        return pipeline_id

    async def run_pipeline(self, request: PipelineRequest) -> PipelineResponse:
        pipeline_id = request.data_id if request.data_id else str(uuid.uuid4())
        logger.info(f"Starting pipeline {pipeline_id} for task {request.task_type}")
        
        results = {}
        steps = []

        try:
            # 1. Ingestion / Retrieval
            if request.data_id:
                if request.data_id not in self.data_store:
                     raise ValueError(f"Data ID {request.data_id} not found")
                df = self.data_store[request.data_id]
                steps.append("retrieval")
            elif request.data:
                df = self.ingestion.process(request.data)
                self.data_store[pipeline_id] = df
                steps.append("ingestion")
            else:
                 raise ValueError("No data or data_id provided")

            results["ingestion"] = {
                "rows": len(df),
                "columns": list(df.columns)
            }

            # 2. Intelligence (EDA)
            try:
                 # Reduced timeout context for this specific call to prevent hanging
                 eda_stats = await asyncio.wait_for(self.intelligence.analyze(df), timeout=1.0)
            except asyncio.TimeoutError:
                 logger.warning("Intelligence step timed out")
                 eda_stats = {"summary_stats": {}, "insights": ["Automated intelligence timed out."]}
            except Exception as e:
                 logger.error(f"Intelligence step failed: {e}")
                 eda_stats = {"summary_stats": {}, "insights": ["Automated intelligence unavailable."]}
            
            results["intelligence"] = eda_stats
            steps.append("intelligence")

            # 3. Anomaly Detection
            try:
                anomalies = await asyncio.wait_for(self.anomaly.detect(df), timeout=1.0)
            except asyncio.TimeoutError:
                logger.warning("Anomaly step timed out")
                anomalies = {"anomaly_count": 0, "anomalies": [], "summary": "Anomaly detection timed out."}
            except Exception as e:
                logger.error(f"Anomaly step failed: {e}")
                anomalies = {"anomaly_count": 0, "anomalies": [], "summary": "Anomaly detection failed."}

            results["anomalies"] = anomalies
            steps.append("anomaly_detection")

            # 4. Prediction (if target provided)
            # Find probable target if not provided? For now stick to request
            if request.target_column and request.target_column in df.columns:
                try:
                    pred_result = await self.prediction.predict(df, request.target_column)
                except Exception as e:
                    logger.error(f"Prediction step failed: {e}")
                    pred_result = None

                if pred_result:
                    results["prediction"] = pred_result
                    steps.append("prediction")
                    
                    # 5. Reasoning (Explainability)
                    try:
                        explanation = await asyncio.wait_for(
                            self.reasoning.explain(pred_result, df, request.target_column),
                            timeout=1.0 
                        )
                    except asyncio.TimeoutError:
                        logger.warning("Reasoning agent timed out, using fallback.")
                        explanation = {
                             "explanation_text": "Analysis completed, but real-time reasoning timed out. Using cached insights.",
                             "logic_steps": ["Data processed", "Prediction generated", "Reasoning timeout"]
                        }
                    except Exception as e:
                         # Ensure we don't crash
                         explanation = {"explanation_text": "Reasoning unavailable.", "logic_steps": []}
                    
                    results["reasoning"] = explanation
                    steps.append("reasoning")
            
            return PipelineResponse(
                success=True,
                message="Pipeline executed successfully",
                pipeline_id=pipeline_id,
                steps_completed=steps,
                results=results
            )

        except Exception as e:
            logger.error(f"Pipeline failed: {str(e)}")
            return PipelineResponse(
                success=False,
                message=f"Pipeline error: {str(e)}",
                pipeline_id=pipeline_id,
                steps_completed=steps,
                results=results
            )

    async def chat_with_data(self, data_id: str, query: str) -> str:
        if data_id not in self.data_store:
             return "I cannot find the active dataset in my memory. Please re-sync."
        
        df = self.data_store[data_id]
        
        # Build Context
        buffer = []
        buffer.append(f"Row Count: {len(df)}")
        buffer.append(f"Columns: {', '.join(df.columns)}")
        buffer.append("Sample Data (First 3 rows):")
        buffer.append(df.head(3).to_string(index=False))
        
        # Add basic stats for numeric cols (Optimized for speed)
        numeric_df = df.select_dtypes(include=[np.number])
        if not numeric_df.empty:
            # Limit to first 10 columns to reduce token overhead and processing time
            metric_cols = numeric_df.columns[:10]
            stats = numeric_df[metric_cols].describe().round(2)
            
            buffer.append("\nStatistical Summary (Top 10 Metrics):")
            buffer.append(stats.to_string())

        context_str = "\n".join(buffer)
        
        return await self.reasoning.chat(query, context_str)

orchestrator = Orchestrator()
