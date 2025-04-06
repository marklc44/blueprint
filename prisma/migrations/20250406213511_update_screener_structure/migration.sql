/*
  Warnings:

  - You are about to drop the column `screenerId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `screenerId` on the `ScreenerResponse` table. All the data in the column will be lost.
  - Added the required column `screenerSectionId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disorder` to the `Screener` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Screener` table without a default value. This is not possible if the table is not empty.
  - Added the required column `screenerSectionId` to the `Screener` table without a default value. This is not possible if the table is not empty.
  - Added the required column `screenerSectionId` to the `ScreenerResponse` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ScreenerSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "screenerId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AnswerOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "screenerSectionId" TEXT NOT NULL,
    CONSTRAINT "AnswerOption_screenerSectionId_fkey" FOREIGN KEY ("screenerSectionId") REFERENCES "ScreenerSection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "domainId" TEXT NOT NULL,
    "screenerSectionId" TEXT NOT NULL,
    CONSTRAINT "Question_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Question_screenerSectionId_fkey" FOREIGN KEY ("screenerSectionId") REFERENCES "ScreenerSection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("createdAt", "domainId", "id", "updatedAt") SELECT "createdAt", "domainId", "id", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE TABLE "new_Screener" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "screenerJson" JSONB NOT NULL,
    "disorder" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "screenerSectionId" TEXT NOT NULL,
    CONSTRAINT "Screener_screenerSectionId_fkey" FOREIGN KEY ("screenerSectionId") REFERENCES "ScreenerSection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Screener" ("createdAt", "id", "name", "screenerJson", "updatedAt") SELECT "createdAt", "id", "name", "screenerJson", "updatedAt" FROM "Screener";
DROP TABLE "Screener";
ALTER TABLE "new_Screener" RENAME TO "Screener";
CREATE UNIQUE INDEX "Screener_name_key" ON "Screener"("name");
CREATE TABLE "new_ScreenerResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "screenerSectionId" TEXT NOT NULL,
    CONSTRAINT "ScreenerResponse_screenerSectionId_fkey" FOREIGN KEY ("screenerSectionId") REFERENCES "ScreenerSection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ScreenerResponse" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "ScreenerResponse";
DROP TABLE "ScreenerResponse";
ALTER TABLE "new_ScreenerResponse" RENAME TO "ScreenerResponse";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
