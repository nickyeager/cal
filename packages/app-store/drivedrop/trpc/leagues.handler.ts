import type { PrismaClient } from "@calcom/prisma/client";
import type { TrpcSessionUser } from "@calcom/trpc/server/trpc";

// import type { BasecampToken } from "../lib/CalendarService";
// import { refreshAccessToken } from "../lib/helpers";

interface LeagueHandlerOptions {
  ctx: {
    prisma: PrismaClient;
    user: NonNullable<TrpcSessionUser>;
  };
  //input: TPlayerSchema;
}

export const leagueHandler = async ({ ctx }: LeagueHandlerOptions) => {
  const { prisma } = ctx;
  const teams = await prisma.team.findMany();
  const users = await prisma.user.findMany();

  return { teams, users };
};

export default leagueHandler;
