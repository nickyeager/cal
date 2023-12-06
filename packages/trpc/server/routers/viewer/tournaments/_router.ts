import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { ZGetInputSchema } from "../tournaments/get.schema";
import { ZCreateInputSchema } from "./create.schema";

type TournamentsRouterHandlerCache = {
  get?: typeof import("./get.handler").getHandler;
  list?: typeof import("./list.handler").listHandler;
  // listOwnedTeams?: typeof import("./listOwnedTeams.handler").listOwnedTeamsHandler;
  create?: typeof import("./create.handler").createTournamentHandler;
  listInvites?: typeof import("./listInvites.handler").listInvitesHandler;
  createInvite?: typeof import("./createInvite.handler").createInviteHandler;
  setInviteExpiration?: typeof import("./setInviteExpiration.handler").setInviteExpirationHandler;
  deleteInvite?: typeof import("./deleteInvite.handler").deleteInviteHandler;
  inviteMemberByToken?: typeof import("./inviteMemberByToken.handler").inviteMemberByTokenHandler;
  inviteMember?: typeof import("./inviteMember/inviteMember.handler").inviteMemberHandler;
};
const UNSTABLE_HANDLER_CACHE: TournamentsRouterHandlerCache = {};

export const tournamentsRouter = router({
  // Retrieves tournament by id
  get: authedProcedure.input(ZGetInputSchema).query(async ({ ctx, input }) => {
    if (!UNSTABLE_HANDLER_CACHE.get) {
      UNSTABLE_HANDLER_CACHE.get = await import("./get.handler").then((mod) => mod.getHandler);
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.get) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.get({
      ctx,
      input,
    });
  }),
  create: authedProcedure.input(ZCreateInputSchema).mutation(async ({ ctx, input }) => {
    if (!UNSTABLE_HANDLER_CACHE.create) {
      UNSTABLE_HANDLER_CACHE.create = await import("./create.handler").then(
        (mod) => mod.createTournamentHandler
      );
    }
    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.create) {
      throw new Error("Failed to load handler");
    }
    return UNSTABLE_HANDLER_CACHE.create({
      ctx,
      input,
    });
  }),

  list: authedProcedure.query(async ({ ctx }) => {
    if (!UNSTABLE_HANDLER_CACHE.list) {
      UNSTABLE_HANDLER_CACHE.list = await import("./list.handler").then((mod) => mod.listHandler);
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.list) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.list({
      ctx,
    });
  }),
});
