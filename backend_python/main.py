

# coding: utf-8
"""
通常のCRUD API
SQLAlchemyを用いたデータベース操作
画像ファイルアップロード対応
"""

import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ================================================================
# FastAPI Application and Endpoint Definitions
# ================================================================
app = FastAPI()

@app.get("/health")
def health_check():
    """
    Endpoint for health check.
    
    Returns:
        A JSON object indicating the health status.
    """
    return {"status": "healthy"}

# ================================================================
# Application Entry Point
# ================================================================
if __name__ == '__main__':
    import uvicorn
    # Run the FastAPI application
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)