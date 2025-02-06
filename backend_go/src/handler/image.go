package handler

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"backend/src/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ImageHandler struct {
	db *gorm.DB
}

func NewImageHandler(db *gorm.DB) *ImageHandler {
	return &ImageHandler{db: db}
}

// CreateImage godoc
// @Summary      Upload new image
// @Description  Create a new image record with file upload, save file to local storage and record meta data in DB
// @Tags         images
// @Accept       multipart/form-data
// @Produce      json
// @Param        title formData string true "Image title"
// @Param        file formData file true "Image file"
// @Success      201 {object} model.Image
// @Router       /images [post]
func (h *ImageHandler) Create(c *gin.Context) {
	// Read the image title from form data
	title := c.PostForm("title")
	if title == "" {
		title = "Untitled"
	}

	// Retrieve the file from form-data
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}

	// Generate a new unique file name
	newFileName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
	
	// Define the upload path and create the directory if it doesn't exist
	uploadPath := "public/upload"
	if err := os.MkdirAll(uploadPath, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create upload directory"})
		return
	}
	filePath := filepath.Join(uploadPath, newFileName)

	// Save the uploaded file to the server
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save uploaded file"})
		return
	}

	// Create the image record in the database
	imageRecord := model.Image{
		Title:     title,
		ImageURL:  "/upload/" + newFileName,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := h.db.Create(&imageRecord).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, imageRecord)
}

// FindAllImages godoc
// @Summary      List images
// @Description  Get all image records from the images table
// @Tags         images
// @Accept       json
// @Produce      json
// @Success      200 {array} model.Image
// @Router       /images [get]
func (h *ImageHandler) FindAll(c *gin.Context) {
	var images []model.Image
	if err := h.db.Find(&images).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, images)
}
