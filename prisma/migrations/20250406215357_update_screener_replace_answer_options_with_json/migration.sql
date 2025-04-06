/*
  Warnings:

  - You are about to drop the `AnswerOption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `answers` to the `ScreenerSection` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AnswerOption";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ScreenerSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "screenerId" TEXT NOT NULL,
    CONSTRAINT "ScreenerSection_screenerId_fkey" FOREIGN KEY ("screenerId") REFERENCES "Screener" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ScreenerSection" ("createdAt", "id", "screenerId", "title", "type", "updatedAt") SELECT "createdAt", "id", "screenerId", "title", "type", "updatedAt" FROM "ScreenerSection";
DROP TABLE "ScreenerSection";
ALTER TABLE "new_ScreenerSection" RENAME TO "ScreenerSection";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
