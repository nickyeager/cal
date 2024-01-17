import { z } from "zod";

export const ZStartOrStopInputSchema = z.object({
  tournamentId: z.number(),
  started: z.boolean(),
});

export type TStartOrStopInputSchema = z.infer<typeof ZStartOrStopInputSchema>;
