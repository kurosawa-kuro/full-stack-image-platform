package router

import (
	"backend/src/handler"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Setup initializes the router and its routes
func Setup(db *gorm.DB, r *gin.Engine) {
	// Micropost handlers
	micropostHandler := handler.NewMicropostHandler(db)

	microposts := r.Group("/microposts")
	{
		microposts.POST("", micropostHandler.Create)
		microposts.GET("", micropostHandler.FindAll)
	}

	// Image handlers
	imageHandler := handler.NewImageHandler(db)

	images := r.Group("/images")
	{
		images.POST("", imageHandler.Create)
		images.GET("", imageHandler.FindAll)
	}
}
