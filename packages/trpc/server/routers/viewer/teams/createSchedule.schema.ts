import { z } from "zod";

export const ZCreateScheduleInputSchema = z.object({
  tournamentId: z.number(),
  teamId: z.number(),
  memberId: z.number(),
  schedule: z.any().optional(),
});

export type TCreateScheduleInputSchema = z.infer<typeof ZCreateScheduleInputSchema>;
