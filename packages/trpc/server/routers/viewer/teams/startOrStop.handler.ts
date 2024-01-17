import { closeComUpsertTeamUser } from "@calcom/lib/sync/SyncServiceManager";
import { prisma } from "@calcom/prisma";
import { MembershipRole } from "@calcom/prisma/enums";
import type { TrpcSessionUser } from "@calcom/trpc/server/trpc";

import type { TAcceptOrLeaveInputSchema } from "./acceptOrLeave.schema";
import { TStartOrStopInputSchema } from "./startOrStop.schema";

type StartOrStopOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TStartOrStopInputSchema;
};

export const startOrStopHandler = async ({ ctx, input }: StartOrStopOptions) => {
  try {
    await prisma.tournament.update({
      where: {
        id: input.tournamentId,
      },
      data: {
        started: input.started,
      },

    });

    } catch (e) {
      console.log(e);
    }
};
