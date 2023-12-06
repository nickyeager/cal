import { markdownToSafeHTML } from "@calcom/lib/markdownToSafeHTML";
import { getTournamentWithMembers } from "@calcom/lib/server/queries/tournaments";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../trpc";
import type { TGetInputSchema } from "./get.schema";

type GetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGetInputSchema;
};

export const getHandler = async ({ ctx, input }: GetOptions) => {
  const tournament = await getTournamentWithMembers({
    id: input.tournamentId,
    userId: ctx.user.organization?.isOrgAdmin ? undefined : ctx.user.id,
  });

  if (!tournament) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Tournament not found." });
  }

  const membership = tournament?.members.find((membership) => membership.id === ctx.user.id);

  return {
    ...tournament,
    safeBio: markdownToSafeHTML(tournament.bio),
    participation: {
      accepted: membership?.accepted,
    },
  };
};
