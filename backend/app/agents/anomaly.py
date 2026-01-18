import pandas as pd
from sklearn.ensemble import IsolationForest
from typing import Dict, Any, List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from app.core.config import settings
import logging

logger = logging.getLogger("AnomalyAgent")

class AnomalyAgent:
    def __init__(self):
        self.llm = None
        if settings.GEMINI_API_KEY:
            try:
                self.llm = ChatGoogleGenerativeAI(
                    model="gemini-1.5-flash",
                    google_api_key=settings.GEMINI_API_KEY,
                    temperature=0.1
                )
            except Exception as e:
                logger.error(f"Failed to initialize Gemini LLM: {e}")

    async def detect(self, df: pd.DataFrame, contamination: float = 0.05) -> Dict[str, Any]:
        """
        Detect anomalies and explain them using Gemini.
        Async wrapper.
        """
        import asyncio
        return await asyncio.to_thread(self._detect_sync, df, contamination)

    def _detect_sync(self, df: pd.DataFrame, contamination: float = 0.05) -> Dict[str, Any]:
        """
        Synchronous internal method for anomaly detection.
        """
        numeric_df = df.select_dtypes(include=['number'])
        if numeric_df.empty:
            return {"anomaly_count": 0, "anomalies": [], "summary": "No numeric data for screening."}
            
        numeric_df = numeric_df.fillna(0)
        clf = IsolationForest(contamination=contamination, random_state=42)
        clf.fit(numeric_df)
        preds = clf.predict(numeric_df) 
        scores = clf.decision_function(numeric_df)
        
        anomalies = []
        for i, pred in enumerate(preds):
            if pred == -1:
                anomalies.append({
                    "row_index": i,
                    "score": float(scores[i]),
                    "data_preview": df.iloc[i].to_dict()
                })
        
        # AI Summary of anomalies
        ai_summary = "All data points reside within statistical tolerance thresholds."
        if anomalies and self.llm:
            try:
                prompt = ChatPromptTemplate.from_messages([
                    ("system", "You are the Sentinel Risk Agent. Summarize the following anomalies detected in a dataset."),
                    ("user", "Anomalies found: {count}. Samples: {samples}. Write a 1-sentence professional risk assessment.")
                ])
                chain = prompt | self.llm
                response = chain.invoke({
                    "count": len(anomalies),
                    "samples": str(anomalies[:2])
                })
                ai_summary = response.content.strip()
            except Exception as e:
                logger.error(f"Anomaly LLM failed: {e}")
                ai_summary = f"Detected {len(anomalies)} structural outliers requiring manual review."
        elif anomalies:
            ai_summary = f"Detected {len(anomalies)} structural outliers requiring manual review."

        return {
            "anomaly_count": len(anomalies),
            "anomalies": anomalies[:20],
            "summary": ai_summary
        }
