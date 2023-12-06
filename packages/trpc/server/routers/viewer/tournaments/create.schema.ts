import { z } from "zod";

export const ZTournamentCreateInput = z.object({
  name: z.string(),
  startDate: z.date(),
  logo: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v || null),
  // Add more properties as needed
});

export const ZTournament = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.date(),
  // Add more properties as needed
});

export const ZTournamentCreateResponse = z.object({
  tournament: ZTournament,
});

export const ZCreateInputSchema = z.object({
  name: z.string(),
  slug: z.string(),

  logo: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v || null),
});

export type TTournamentCreateInputSchema = z.infer<typeof ZTournamentCreateInput>;
export type TTournamentSchema = z.infer<typeof ZTournament>;
export type TTournamentCreateResponseSchema = z.infer<typeof ZTournamentCreateResponse>;
export type TCreateInputSchema = z.infer<typeof ZCreateInputSchema>;
