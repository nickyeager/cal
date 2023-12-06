import { prisma } from "@calcom/prisma";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../trpc";
import type { TCreateInputSchema } from "./create.schema";

type CreateOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TCreateInputSchema;
};

export const createTournamentHandler = async ({ ctx, input }: CreateOptions) => {
  const { user } = ctx;
  const { name, logo, slug, startDate } = input;

  if (user.organizationId && !user.organization.isOrgAdmin) {
    throw new TRPCError({ code: "FORBIDDEN", message: "only_org_admins_can_create_tournaments" });
  }

  // // Check for slug collisions
  // const slugCollisions = await prisma.tournament.findFirst({
  //   where: { slug },
  // });
  //
  // if (slugCollisions) throw new TRPCError({ code: "BAD_REQUEST", message: "tournament_slug_taken" });

  // Check for name collisions within the organization
  // if (user.organizationId) {
  //   const nameCollisions = await prisma.tournament.findFirst({
  //     where: {
  //       organizationId: user.organizationId,
  //       name,
  //     },
  //   });
  //
  //   if (nameCollisions) throw new TRPCError({ code: "BAD_REQUEST", message: "tournament_name_exists_in_org" });
  // }
  let createTournament = {};
  try {
    createTournament = await prisma.tournament.create({
      data: {
        name,
        logo,
        slug,
        //startDate: Date,
        // Assuming tournaments have members like teams
        members: {
          create: {
            userId: user.id,
            //role: MembershipRole.OWNER,
            //accepted: true,
          },
        },
        // Add other relevant fields and logic as needed
        // ...(user.organizationId && { organizationId: user.organizationId }),
      },
    });
  } catch (e) {
    // Getting "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client" when revalidate calendar chache
    console.log("Error getting create", e);
  }

  // Other logic and integrations as needed

  return createTournament;
};
