import { z } from "zod";

export const ZGetInputSchema = z.object({
  tournamentId: z.number(),
  includeTournamentLogo: z.boolean().optional(),
});

export type TGetInputSchema = z.infer<typeof ZGetInputSchema>;
