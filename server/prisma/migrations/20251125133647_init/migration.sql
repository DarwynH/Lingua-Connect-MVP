-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT,
    "institution" TEXT,
    "bio" TEXT,
    "nativeLanguages" TEXT NOT NULL DEFAULT '[]',
    "learningLanguages" TEXT NOT NULL DEFAULT '[]',
    "proficiencyLevels" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("bio", "createdAt", "email", "fullName", "id", "institution", "learningLanguages", "nativeLanguages", "passwordHash") SELECT "bio", "createdAt", "email", "fullName", "id", "institution", "learningLanguages", "nativeLanguages", "passwordHash" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
