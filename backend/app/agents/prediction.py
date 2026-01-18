import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from typing import Dict, Any, List

class PredictionAgent:
    async def predict(self, df: pd.DataFrame, target_column: str) -> Dict[str, Any]:
        """
        Auto-select model (Simplified for MVP: Random Forest) and predict.
        Async wrapper for heavy export computation.
        """
        import asyncio

        return await asyncio.to_thread(self._predict_sync, df, target_column)

    def _predict_sync(self, df: pd.DataFrame, target_column: str) -> Dict[str, Any]:
        """
        Synchronous internal method for prediction.
        """
        if target_column not in df.columns:
            raise ValueError(f"Target column {target_column} not found in data")

        # 1. Prepare Data
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        # Preprocessing: Drop high cardinality object columns (likely IDs or dates)
        for col in X.select_dtypes(include=['object']):
            if X[col].nunique() > len(X) * 0.9: # If >90% unique, potential ID
                X = X.drop(columns=[col])
            elif 'date' in col.lower() or 'time' in col.lower() or 'id' in col.lower() or 'index' in col.lower():
                 X = X.drop(columns=[col])

        # Simple encoding for categorical features
        X = pd.get_dummies(X, drop_first=True)
        
        # Determine Task Type
        is_classification = False
        if y.dtype == 'object' or len(y.unique()) < 20: 
             is_classification = True
        
        # 2. Train Model
        if is_classification:
            model = RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1) # Reduced estimators for speed
            model_name = "RandomForestClassifier"
        else:
            model = RandomForestRegressor(n_estimators=50, random_state=42, n_jobs=-1) # Reduced estimators for speed
            model_name = "RandomForestRegressor"
            
        # Evaluate on a split (internal validation)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model.fit(X_train, y_train)
        score = model.score(X_test, y_test) # Accuracy or R^2
        
        # 3. Feature Importance
        importances = dict(zip(X.columns, model.feature_importances_))
        sorted_importances = dict(sorted(importances.items(), key=lambda item: item[1], reverse=True))
        
        # 4. Generate Predictions
        # Only predict on test set or small subset to save time if dataset is huge.
        # But user wants "full preds" sometimes. Let's stick to full but efficient.
        full_preds = model.predict(X)
        
        result_metrics = {
            "score": float(score),
            "metric_name": "Accuracy" if is_classification else "R^2"
        }
        
        # Combine actuals and preds for return
        preview_data = []
        # Return more points for better visualization (e.g. 50)
        for i in range(min(50, len(y))):
            preview_data.append({
                "index": i,
                "actual": float(y.iloc[i]) if not isinstance(y.iloc[i], str) else str(y.iloc[i]),
                "predicted": float(full_preds[i]) if not isinstance(full_preds[i], str) else str(full_preds[i])
            })

        return {
            "model_used": model_name,
            "accuracy_metrics": result_metrics,
            "predictions": preview_data,
            "feature_importance": sorted_importances,
            "is_classification": is_classification
        }
