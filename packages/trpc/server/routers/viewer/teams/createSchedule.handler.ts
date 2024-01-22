import { isTeamAdmin } from "@calcom/lib/server/queries";
import { prisma } from "@calcom/prisma";
import type { TrpcSessionUser } from "@calcom/trpc/server/trpc";

import { TRPCError } from "@trpc/server";

import type { TCreateScheduleInputSchema } from "./createSchedule.schema";

type CreateScheduleHandlerOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TCreateScheduleInputSchema;
};

export const createScheduleHandler = async ({ ctx, input }: CreateScheduleHandlerOptions) => {
  try {
    if (!isTeamAdmin(ctx.user.id, input.teamId)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be an admin to set the schedule.",
      });
    }

    // if (!input.players || input.players.length === 0) {
    //   throw new Error("No players provided for the tournament.");
    // }

    const schedule = input.schedule ?? [];

    const matchData = schedule.flatMap((round, roundIndex) =>
      round.map((match, matchIndex) => ({
        round: roundIndex + 1,
        matchNumber: matchIndex + 1,
        players: {
          create: [
            { userId: match.home.id }, // Ensure 'match.home' is a valid user ID
            { userId: match.away.id }, // Ensure 'match.away' is a valid user ID
          ],
        },
      }))
    );

    // Debugging: Log the matchData structure
    console.log("Generated match data:", matchData);

    await prisma.tournament.update({
      where: { id: input.tournamentId },
      data: {
        matches: {
          create: matchData,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error in createScheduleHandler:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while creating the schedule.",
    });
  }
};
