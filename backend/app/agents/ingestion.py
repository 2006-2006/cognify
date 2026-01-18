from typing import List, Dict, Any, Union
import pandas as pd
import io
import logging

logger = logging.getLogger(__name__)

class IngestionAgent:
    def process_file(self, file_content: bytes, filename: str) -> pd.DataFrame:
        """
        Parse file content (CSV/Excel) into DataFrame.
        """
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(file_content))
            elif filename.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(io.BytesIO(file_content))
            elif filename.endswith('.json'):
                df = pd.read_json(io.BytesIO(file_content))
            else:
                raise ValueError(f"Unsupported file format: {filename}")
            
            return self._clean_data(df)
        except Exception as e:
            logger.error(f"Error processing file {filename}: {str(e)}")
            raise ValueError(f"Failed to process file: {str(e)}")

    def process(self, data: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Ingest list of dicts.
        """
        if not data:
            raise ValueError("No data provided for ingestion")
        
        df = pd.DataFrame(data)
        return self._clean_data(df)

    def _clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Shared cleaning logic.
        """
        
        # 1. Basic cleaning: Drop empty columns/rows if fully empty
        df.dropna(how='all', inplace=True)
        df.dropna(axis=1, how='all', inplace=True)
        
        # 2. Type inference (Pandas does this well, but we can enforce)
        df = df.infer_objects()
        
        # 3. Fill missing numeric values with mean (simple strategy)
        # In a real system, we'd have a configurable strategy
        numeric_cols = df.select_dtypes(include=['number']).columns
        df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())
        
        # 4. Fill missing categorical with mode
        cat_cols = df.select_dtypes(include=['object', 'category']).columns
        for col in cat_cols:
             if df[col].isnull().any():
                 mode_val = df[col].mode()
                 if not mode_val.empty:
                     df[col] = df[col].fillna(mode_val[0])
        
        return df
