/*
  Warnings:

  - You are about to drop the column `screenerSectionId` on the `Screener` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Screener" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "disorder" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL
);
INSERT INTO "new_Screener" ("createdAt", "disorder", "displayName", "fullName", "id", "name", "updatedAt") SELECT "createdAt", "disorder", "displayName", "fullName", "id", "name", "updatedAt" FROM "Screener";
DROP TABLE "Screener";
ALTER TABLE "new_Screener" RENAME TO "Screener";
CREATE UNIQUE INDEX "Screener_name_key" ON "Screener"("name");
CREATE TABLE "new_ScreenerSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "screenerId" TEXT NOT NULL,
    CONSTRAINT "ScreenerSection_screenerId_fkey" FOREIGN KEY ("screenerId") REFERENCES "Screener" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ScreenerSection" ("createdAt", "id", "screenerId", "updatedAt") SELECT "createdAt", "id", "screenerId", "updatedAt" FROM "ScreenerSection";
DROP TABLE "ScreenerSection";
ALTER TABLE "new_ScreenerSection" RENAME TO "ScreenerSection";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
