package model

import (
	"time"
)

type Image struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `gorm:"not null" json:"title"`
	ImageURL  string    `gorm:"not null" json:"image_url"`
	CreatedAt time.Time `gorm:"type:datetime" json:"created_at"` // 明示的に datetime 型を指定
	UpdatedAt time.Time `gorm:"type:datetime" json:"updated_at"`
}