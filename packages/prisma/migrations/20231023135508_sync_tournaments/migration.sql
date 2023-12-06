-- CreateEnum
CREATE TYPE "TournamentType" AS ENUM ('KNOCKOUT', 'ROUND_ROBIN', 'LADDER', 'KING_OF_COURT');

-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "type" "TournamentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTournament" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMatch" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER NOT NULL,

    CONSTRAINT "UserMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "scores" INTEGER[],
    "winnerIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserTournament" ADD CONSTRAINT "UserTournament_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTournament" ADD CONSTRAINT "UserTournament_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMatch" ADD CONSTRAINT "UserMatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMatch" ADD CONSTRAINT "UserMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
