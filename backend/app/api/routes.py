from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File
from app.models.schemas import PipelineRequest, PipelineResponse, DataIngestionResponse, ChatRequest, ChatResponse
from app.core.orchestrator import orchestrator

router = APIRouter()

@router.post("/pipeline/upload", response_model=DataIngestionResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a CSV/Excel/JSON file for processing.
    """
    try:
        contents = await file.read()
        data_id = await orchestrator.ingest_file(contents, file.filename)
        
        # Get basic stats for response
        df = orchestrator.data_store[data_id]
        
        return DataIngestionResponse(
            success=True,
            message="File uploaded and processed successfully",
            data_id=data_id,
            record_count=len(df),
            schema_summary={col: str(dtype) for col, dtype in df.dtypes.items()}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pipeline/run", response_model=PipelineResponse)
async def run_pipeline(request: PipelineRequest):
    """
    Trigger the main autonomous pipeline.
    """
    try:
        response = await orchestrator.run_pipeline(request)
        if not response.success:
            raise HTTPException(status_code=500, detail=response.message)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
async def chat_with_data(request: ChatRequest):
    """
    Chat with the AI about the ingested dataset.
    """
    try:
        reply_text = await orchestrator.chat_with_data(request.data_id, request.query)
        return ChatResponse(
            success=True,
            message="Query processed",
            reply=reply_text
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
def health_check():
    return {"status": "ok", "components": "all agents operational"}
