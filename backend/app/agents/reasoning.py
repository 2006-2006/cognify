from typing import Dict, Any
import pandas as pd
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from app.core.config import settings
import logging

logger = logging.getLogger("ReasoningAgent")

class ReasoningAgent:
    def __init__(self):
        self.llm = None
        if settings.GEMINI_API_KEY:
            try:
                self.llm = ChatGoogleGenerativeAI(
                    model="gemini-1.5-flash",
                    google_api_key=settings.GEMINI_API_KEY,
                    temperature=0.2
                )
            except Exception as e:
                logger.error(f"Failed to initialize Gemini LLM: {e}")

    async def explain(self, prediction_result: Dict[str, Any], df: pd.DataFrame, target_col: str) -> Dict[str, Any]:
        """
        Generate natural language explanations and semantic insights using Gemini.
        OPTIMIZED FOR SPEED: < 3.5s timeout.
        """
        import asyncio
        
        model_name = prediction_result.get("model_used", "Autonomous Core")
        importances = prediction_result.get("feature_importance", {})
        accuracy = prediction_result.get("accuracy_metrics", {}).get("score", 0)
        
        # Top drivers for context
        top_drivers = list(importances.keys())[:3] # Reduced to 3 for brevity
        
        fallback_response = {
            "explanation_text": f"High-confidence projection triggered by {', '.join(top_drivers)}.",
            "top_drivers": top_drivers,
            "confidence_score": accuracy,
            "logic_steps": [
                f"Calibrating vectors on {target_col}",
                f"Identified {top_drivers[0] if top_drivers else 'primary factor'} as key driver",
                "Synthesizing final cognitive output"
            ]
        }

        if not self.llm:
            return fallback_response

        try:
            # Ultra-short, efficient prompt for fast generation
            prompt = ChatPromptTemplate.from_messages([
                ("user", """
                Quickly analyze this AI prediction:
                Target: {target}
                Drivers: {drivers}
                
                Provide exactly 3 short, punchy logic steps (max 6 words each) that explain the decision.
                Format:
                - Step 1
                - Step 2
                - Step 3
                """)
            ])

            chain = prompt | self.llm
            
            # STRICT TIMEOUT: 3.5 seconds
            response = await asyncio.wait_for(
                chain.ainvoke({
                    "target": target_col,
                    "drivers": ", ".join(top_drivers)
                }),
                timeout=3.5
            )

            # Fast parsing
            lines = [line.strip().replace('- ', '').replace('* ', '') for line in response.content.split('\n') if line.strip()]
            logic_steps = lines[:3] if len(lines) >= 3 else fallback_response["logic_steps"]
            
            return {
                "explanation_text": f"Analysis based on {len(top_drivers)} key variables.",
                "top_drivers": top_drivers,
                "confidence_score": accuracy,
                "logic_steps": logic_steps
            }

        except asyncio.TimeoutError:
            logger.warning("LLM Reasoning timed out - using fallback")
            return fallback_response
        except Exception as e:
            logger.error(f"LLM Reasoning failed: {e}")
            return fallback_response

    async def chat(self, query: str, context_summary: str) -> str:
        """
        Free-form chat with the AI about the dataset.
        """
        import asyncio
        
        if not self.llm:
            return "I am running in offline mode. Please check my neural connection keys."

        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are an advanced AI Data Analyst trained by Google DeepMind. 
                Your persona is professional, concise, and highly intelligent. 
                You have access to a dataset summary provided below.
                Answer the user's question based strictly on this data context. 
                If the answer isn't in the data, state that clearly but offer a hypothesis based on general knowledge if applicable.
                
                Dataset Context:
                {context}
                """),
                ("user", "{query}")
            ])

            chain = prompt | self.llm
            
            response = await chain.ainvoke({
                "context": context_summary,
                "query": query
            })
            
            return response.content

        except Exception as e:
            logger.error(f"Chat failed: {e}")
            return f"I encountered a neural processing error: {str(e)}"
