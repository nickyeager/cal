/*
  Warnings:

  - A unique constraint covering the columns `[userId,tournamentId]` on the table `UserTournament` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserTournament" DROP CONSTRAINT "UserTournament_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "UserTournament" DROP CONSTRAINT "UserTournament_userId_fkey";

-- AlterTable
ALTER TABLE "UserTournament" ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "MembershipRole" NOT NULL DEFAULT 'MEMBER';

-- CreateIndex
CREATE INDEX "UserTournament_tournamentId_idx" ON "UserTournament"("tournamentId");

-- CreateIndex
CREATE INDEX "UserTournament_userId_idx" ON "UserTournament"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTournament_userId_tournamentId_key" ON "UserTournament"("userId", "tournamentId");

-- AddForeignKey
ALTER TABLE "UserTournament" ADD CONSTRAINT "UserTournament_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTournament" ADD CONSTRAINT "UserTournament_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
