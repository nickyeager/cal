//TODO: Generate this file automatically so that like in Next.js file based routing can work automatically
import * as league from "./league/[...appPages]";
import * as leagues from "./leagues/index";
import * as newLeague from "./leagues/new/index";

const routingConfig = {
  league: league,
  leagues: leagues,
  "leagues/new": newLeague,
};

export default routingConfig;
