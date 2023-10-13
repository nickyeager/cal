import driveDropRouter from "@calcom/app-store/drivedrop/trpc-router";
import { createNextApiHandler } from "@calcom/trpc/server/createNextApiHandler";

export default createNextApiHandler(driveDropRouter);
