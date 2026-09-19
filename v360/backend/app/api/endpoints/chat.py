from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import ai_service
import pandas as pd
import json

router = APIRouter()

class QueryRequest(BaseModel):
    question: str
    preview: bool = False
    sql: str = None

class QueryResponse(BaseModel):
    question: str
    sql: str
    table_data: list = None
    chart_data: dict = None
    insights: str = None
    explanation: str = None
    stat_summary: str = None
    is_preview: bool = False
    error: str = None

@router.post("/query", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    try:
        # Use provided SQL or generate new one
        sql = request.sql or ai_service.generate_sql(request.question)
        if not sql:
            raise HTTPException(status_code=400, detail="Could not generate SQL for the question.")
            
        # Run SQL
        df = ai_service.run_sql(sql)
        
        if request.preview:
            # Just return sample data for confirmation
            sample_df = df.head(5)
            table_data = sample_df.to_dict(orient="records")
            return QueryResponse(
                question=request.question,
                sql=sql,
                table_data=table_data,
                is_preview=True
            )
        
        # Full execution
        table_data = df.to_dict(orient="records") if isinstance(df, pd.DataFrame) else []
        
        # Additional Groq tasks
        insights = ai_service.generate_insights(question=request.question, sql=sql, df=df)
        stat_summary = ai_service.generate_stat_summary(df)
        chart_data = ai_service.get_chart_data(df)
        
        return QueryResponse(
            question=request.question,
            sql=sql,
            table_data=table_data,
            chart_data=chart_data,
            insights=insights,
            stat_summary=stat_summary,
            is_preview=False
        )
    except Exception as e:
        return QueryResponse(
            question=request.question,
            sql="",
            error=str(e)
        )

@router.get("/history")
async def get_history():
    return {"history": []}

@router.post("/connect")
async def connect_db():
    try:
        # Just try to get connection to verify
        ai_service._get_connection()
        return {"message": "Successfully connected to MySQL"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to MySQL: {str(e)}")

