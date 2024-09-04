/*
  Warnings:

  - You are about to drop the column `date` on the `TeamsOnMatch` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `TeamsOnMatch` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "isStarted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Match_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("awayScore", "createdAt", "date", "homeScore", "id", "updatedAt", "userId") SELECT "awayScore", "createdAt", "date", "homeScore", "id", "updatedAt", "userId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE TABLE "new_TeamsOnMatch" (
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "teamId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "homeTeam" BOOLEAN NOT NULL,

    PRIMARY KEY ("teamId", "matchId"),
    CONSTRAINT "TeamsOnMatch_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeamsOnMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TeamsOnMatch" ("createdAt", "homeTeam", "matchId", "teamId", "updatedAt") SELECT "createdAt", "homeTeam", "matchId", "teamId", "updatedAt" FROM "TeamsOnMatch";
DROP TABLE "TeamsOnMatch";
ALTER TABLE "new_TeamsOnMatch" RENAME TO "TeamsOnMatch";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
