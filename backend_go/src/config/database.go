package config

import (
	"fmt"
	"os"

	"backend/src/model"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func SetupDB() *gorm.DB {
	// Use environment variable to specify SQLite database file, default to "database.db"
	dbFile := os.Getenv("SQLITE_DB")
	if dbFile == "" {
		dbFile = "database.db"
	}

	fmt.Printf("Connecting to SQLite database: %s\n", dbFile)

	db, err := gorm.Open(sqlite.Open(dbFile), &gorm.Config{})
	if err != nil {
		fmt.Printf("Connection error: %v\n", err)
		panic("Failed to connect to SQLite database")
	}

	fmt.Println("Successfully connected to SQLite database!")

	// Auto-migrate the schema for model.Micropost
	db.AutoMigrate(&model.Micropost{})

	return db
}
