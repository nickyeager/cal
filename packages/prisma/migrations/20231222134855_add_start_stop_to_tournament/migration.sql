-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "started" BOOLEAN NOT NULL DEFAULT false;
