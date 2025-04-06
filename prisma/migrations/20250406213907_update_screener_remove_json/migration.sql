/*
  Warnings:

  - You are about to drop the column `screenerJson` on the `Screener` table. All the data in the column will be lost.

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
    "displayName" TEXT NOT NULL,
    "screenerSectionId" TEXT NOT NULL,
    CONSTRAINT "Screener_screenerSectionId_fkey" FOREIGN KEY ("screenerSectionId") REFERENCES "ScreenerSection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Screener" ("createdAt", "disorder", "displayName", "fullName", "id", "name", "screenerSectionId", "updatedAt") SELECT "createdAt", "disorder", "displayName", "fullName", "id", "name", "screenerSectionId", "updatedAt" FROM "Screener";
DROP TABLE "Screener";
ALTER TABLE "new_Screener" RENAME TO "Screener";
CREATE UNIQUE INDEX "Screener_name_key" ON "Screener"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
