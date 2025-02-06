sqlx
onix
cors
category crud


url      = "postgresql://dbmasteruser:dbmaster@ls-644e915cc7a6ba69ccf824a69cef04d45c847ed5.cps8g04q216q.ap-northeast-1.rds.amazonaws.com:5432/dbmaster?sslmode=require"

// カテゴリー
model Category {
  id              Int       @id @default(autoincrement())
  name            String    @unique
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt 
 }

 Categoryではなく、独立したSampleテーブルでCRUD,TEｓｔ実装する