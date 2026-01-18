import requests
import json
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_pipeline():
    print("Testing Pipeline...")
    
    # Mock Data
    payload = {
        "data": [
            {"sq_ft": 1000, "price": 200000, "bedrooms": 2},
            {"sq_ft": 1500, "price": 300000, "bedrooms": 3},
            {"sq_ft": 2000, "price": 400000, "bedrooms": 4},
            {"sq_ft": 5000, "price": 10000000, "bedrooms": 10} # Potential Anomaly
        ],
        "task_type": "full_suite",
        "target_column": "price"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/pipeline/run", json=payload)
        response.raise_for_status()
        result = response.json()
        
        print("Pipeline Status:", result['success'])
        print("Pipeline ID:", result['pipeline_id'])
        print("Steps Completed:", result['steps_completed'])
        
        if result.get("results"):
            preds = result['results'].get('prediction')
            if preds:
                print(f"Model Used: {preds.get('model_used')}")
                print(f"Accuracy: {preds.get('accuracy_metrics')}")
            
            anom = result['results'].get('anomalies')
            if anom:
                print(f"Anomalies Found: {anom.get('anomaly_count')}")
                
            reasoning = result['results'].get('reasoning')
            if reasoning:
                print(f"Explanation: {reasoning.get('explanation_text')}")

    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    # Wait for server to be ready
    time.sleep(2)
    test_pipeline()
