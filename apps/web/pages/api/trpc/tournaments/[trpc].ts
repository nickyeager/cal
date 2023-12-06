import { createNextApiHandler } from "@calcom/trpc/server/createNextApiHandler";
import { tournamentsRouter } from "@calcom/trpc/server/routers/viewer/tournaments/_router";

export default createNextApiHandler(tournamentsRouter);
