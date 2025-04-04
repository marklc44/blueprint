/*
  Warnings:

  - You are about to drop the column `disorder` on the `Screener` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Screener` table. All the data in the column will be lost.
  - Added the required column `screenerResponseId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `screenerJson` to the `Screener` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "screenerResponseId" TEXT NOT NULL,
    CONSTRAINT "Answer_screenerResponseId_fkey" FOREIGN KEY ("screenerResponseId") REFERENCES "ScreenerResponse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Answer" ("createdAt", "id", "questionId", "updatedAt", "value") SELECT "createdAt", "id", "questionId", "updatedAt", "value" FROM "Answer";
DROP TABLE "Answer";
ALTER TABLE "new_Answer" RENAME TO "Answer";
CREATE TABLE "new_Screener" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "screenerJson" TEXT NOT NULL
);
INSERT INTO "new_Screener" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Screener";
DROP TABLE "Screener";
ALTER TABLE "new_Screener" RENAME TO "Screener";
CREATE UNIQUE INDEX "Screener_name_key" ON "Screener"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
