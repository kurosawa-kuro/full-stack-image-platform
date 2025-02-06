# coding: utf-8
"""
通常のCRUD API
SQLAlchemyを用いたデータベース操作（update, destroyは不要）
画像ファイルアップロード対応
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

# Load environment variables from .env file
load_dotenv()

# DB接続設定
DATABASE_URL = "sqlite:///./dev.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemyのImageモデル
class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

# テーブルが存在しない場合作成
Base.metadata.create_all(bind=engine)

# Pydanticスキーマ定義
class ImageRead(BaseModel):
    id: int
    title: str
    image_url: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# DBセッション取得の依存関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

@app.get("/health")
def health_check():
    """
    ヘルスチェック用エンドポイント
    """
    return {"status": "healthy"}

@app.get("/images", response_model=List[ImageRead])
def list_images(db: Session = Depends(get_db)):
    """
    画像情報の一覧取得エンドポイント
    """
    images = db.query(Image).all()
    return images

@app.get("/images/{image_id}", response_model=ImageRead)
def get_image(image_id: int, db: Session = Depends(get_db)):
    """
    IDに紐づく画像情報取得エンドポイント
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
    画像情報の作成エンドポイント
    マルチパートフォームで受け取ったタイトルとファイルを処理し、画像URLを生成します。
    """
    # ファイルの保存処理
    file_data = await file.read()
    timestamp = int(time.time() * 1000)
    # オリジナルのファイル名を利用しユニークな名前を生成
    file_name = f"{timestamp}_{file.filename}"
    upload_dir = os.path.join(os.getcwd(), "public", "upload")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file_name)
    
    with open(file_path, "wb") as f:
        f.write(file_data)
    
    # 画像URLを設定。ここでは/public/upload以下のパスを利用します。
    image_url = f"/upload/{file_name}"
    
    db_image = Image(title=title, image_url=image_url)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

# ================================================================
# Application Entry Point
# ================================================================
if __name__ == '__main__':
    import uvicorn
    # Run the FastAPI application
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)