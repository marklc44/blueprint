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
    CONSTRAINT "ScreenerSection_screenerId_fkey" FOREIGN KEY ("screenerId") REFERENCES "Screener" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ScreenerSection" ("answers", "createdAt", "id", "screenerId", "title", "type", "updatedAt") SELECT "answers", "createdAt", "id", "screenerId", "title", "type", "updatedAt" FROM "ScreenerSection";
DROP TABLE "ScreenerSection";
ALTER TABLE "new_ScreenerSection" RENAME TO "ScreenerSection";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
