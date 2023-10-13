import type { PrismaClient } from "@calcom/prisma/client";
import type { TrpcSessionUser } from "@calcom/trpc/server/trpc";

// import type { BasecampToken } from "../lib/CalendarService";
// import { refreshAccessToken } from "../lib/helpers";

interface PlayerHandlerOptions {
  ctx: {
    prisma: PrismaClient;
    user: NonNullable<TrpcSessionUser>;
  };
  //input: TPlayerSchema;
}

export const playerHandler = async ({ ctx }: PlayerHandlerOptions) => {
  const { prisma } = ctx;
  const attendees = await prisma.attendee.findMany();
  const users = await prisma.user.findMany();

  return { attendees, users };
};

export default playerHandler;
