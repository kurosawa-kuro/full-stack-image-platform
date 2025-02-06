# coding: utf-8
"""
通常のCRUD APIのリファクタリング版
単一責任原則に則り、各処理を専用の関数に切り分けています。
ファイル分割禁止のため、全てのコードを一つのファイルにまとめています。
"""

import os
import time
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel
from typing import List
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

# 環境変数の読み込み
load_dotenv()

# ================================================================
# Database Configuration
# ================================================================
DATABASE_URL = "sqlite:///./dev.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ================================================================
# SQLAlchemy Model
# ================================================================
class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

# テーブルが存在しない場合、作成
Base.metadata.create_all(bind=engine)

# ================================================================
# Pydantic Schemas
# ================================================================
class ImageRead(BaseModel):
    id: int
    title: str
    image_url: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# ================================================================
# Dependency - DB Session
# ================================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================================================================
# Utility Functions
# ================================================================
async def save_uploaded_file(file: UploadFile) -> str:
    """
    Save the uploaded file and return its URL path.
    """
    try:
        file_data = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Error reading file data")

    timestamp = int(time.time() * 1000)
    # Generate a unique filename using timestamp and original filename
    file_name = f"{timestamp}_{file.filename}"
    upload_dir = os.path.join(os.getcwd(), "public", "upload")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file_name)

    try:
        with open(file_path, "wb") as f:
            f.write(file_data)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to save file")
    
    # Return the relative path for the image URL
    return f"/upload/{file_name}"

def create_db_image(db: Session, title: str, image_url: str) -> Image:
    """
    Create a new image record in the database.
    """
    new_image = Image(title=title, image_url=image_url)
    db.add(new_image)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database write failed")
    db.refresh(new_image)
    return new_image

# ================================================================
# FastAPI Application Setup
# ================================================================
app = FastAPI()

@app.get("/health")
def health_check():
    """
    ヘルスチェックエンドポイント
    """
    return {"status": "healthy"}

@app.get("/images", response_model=List[ImageRead])
def list_images(db: Session = Depends(get_db)):
    """
    Retrieve a list of image records.
    """
    images = db.query(Image).all()
    return images

@app.get("/images/{image_id}", response_model=ImageRead)
def get_image(image_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single image record by its ID.
    """
    image = db.query(Image).filter(Image.id == image_id).first()
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return image

@app.post("/images", response_model=ImageRead, status_code=201)
async def create_image(
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Create a new image record by processing multi-part form data.
    """
    # Save uploaded image file and get its URL
    image_url = await save_uploaded_file(file)
    # Create image record in the database using the provided title and generated image URL
    db_image = create_db_image(db, title, image_url)
    return db_image

# ================================================================
# Application Entry Point
# ================================================================
if __name__ == '__main__':
    import uvicorn
    # Start the FastAPI application
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)