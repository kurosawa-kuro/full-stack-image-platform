package handler

import (
	"net/http"

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
// @Summary      Create new image
// @Description  creates a new image record in the images table
// @Tags         images
// @Accept       json
// @Produce      json
// @Param        image  body      model.Image  true  "Image Info"
// @Success      201    {object}  model.Image
// @Router       /images [post]
func (h *ImageHandler) Create(c *gin.Context) {
	var image model.Image
	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Create(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, image)
}

// FindAllImages godoc
// @Summary      List images
// @Description  get all image records from the images table
// @Tags         images
// @Accept       json
// @Produce      json
// @Success      200  {array}   model.Image
// @Router       /images [get]
func (h *ImageHandler) FindAll(c *gin.Context) {
	var images []model.Image
	if err := h.db.Find(&images).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, images)
}
