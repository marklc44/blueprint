/*
  Warnings:

  - Added the required column `displayName` to the `Screener` table without a default value. This is not possible if the table is not empty.

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
INSERT INTO "new_Screener" ("createdAt", "disorder", "fullName", "id", "name", "updatedAt") SELECT "createdAt", "disorder", "fullName", "id", "name", "updatedAt" FROM "Screener";
DROP TABLE "Screener";
ALTER TABLE "new_Screener" RENAME TO "Screener";
CREATE UNIQUE INDEX "Screener_name_key" ON "Screener"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
