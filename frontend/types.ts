export interface PredictionData {
    index: number;
    predicted: number;
    actual: number;
}

export interface PredictionResult {
    predictions: PredictionData[];
    model_used?: string;
    accuracy_metrics?: Record<string, unknown>;
    mean_predicted?: number;
}

export interface AnomalyResult {
    anomaly_count: number;
    anomalies?: Record<string, unknown>[];
}

export interface ReasoningResult {
    explanation_text: string;
    confidence_score: number;
    logic_steps: string[];
    top_drivers?: string[];
}

export interface IntelligenceResult {
    correlations: Record<string, number>[];
    summary_stats?: Record<string, Record<string, number>>;
    missing_values?: Record<string, number>;
    insights?: string[];
}

export interface IngestionResult {
    rows: number;
    columns: string[];
}

export interface PipelineResults {
    ingestion: IngestionResult;
    prediction: PredictionResult;
    reasoning: ReasoningResult;
    anomalies: AnomalyResult;
    intelligence: IntelligenceResult;
    pipeline_id?: string;
}

export interface PipelineResponse {
    success: boolean;
    pipeline_id: string;
    steps_completed: string[];
    results: PipelineResults;
}

export interface MockDataPoint {
    index: number;
    timestamp: string;
    revenue: number;
    operational_cost: number;
    user_load: number;
    server_latency: number;
    target: number;
}
