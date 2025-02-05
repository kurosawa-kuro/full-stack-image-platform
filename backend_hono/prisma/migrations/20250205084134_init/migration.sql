/*
  Warnings:

  - Added the required column `title` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_images" ("created_at", "id", "image_url", "updated_at") SELECT "created_at", "id", "image_url", "updated_at" FROM "images";
DROP TABLE "images";
ALTER TABLE "new_images" RENAME TO "images";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
