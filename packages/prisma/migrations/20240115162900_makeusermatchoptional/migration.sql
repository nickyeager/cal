-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "round" DROP NOT NULL,
ALTER COLUMN "matchNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserMatch" ALTER COLUMN "score" DROP NOT NULL;