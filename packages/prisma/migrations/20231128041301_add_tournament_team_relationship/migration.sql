/*
  Warnings:

  - A unique constraint covering the columns `[tournamentId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamId]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "isTournament" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tournamentId" INTEGER;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "teamId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Team_tournamentId_key" ON "Team"("tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_teamId_key" ON "Tournament"("teamId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
