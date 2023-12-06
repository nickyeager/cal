import { withValidation } from "next-validations";
import { z } from "zod";

import { baseApiParams } from "./baseApiParams";

// Extracted out as utility function so can be reused
// at different endpoints that require this validation.
export const schemaQueryTournamentId = baseApiParams
  .extend({
    tournamentId: z
      .string()
      .regex(/^\d+$/)
      .transform((id) => parseInt(id)),
  })
  .strict();

export const withValidQueryTournamentId = withValidation({
  schema: schemaQueryTournamentId,
  type: "Zod",
  mode: "query",
});
