/*
  Warnings:

  - You are about to alter the column `screenerJson` on the `Screener` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Screener" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "screenerJson" JSONB NOT NULL
);
INSERT INTO "new_Screener" ("createdAt", "id", "name", "screenerJson", "updatedAt") SELECT "createdAt", "id", "name", "screenerJson", "updatedAt" FROM "Screener";
DROP TABLE "Screener";
ALTER TABLE "new_Screener" RENAME TO "Screener";
CREATE UNIQUE INDEX "Screener_name_key" ON "Screener"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
