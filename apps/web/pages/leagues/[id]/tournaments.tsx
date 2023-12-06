//import TeamMembersView from "@calcom/features/ee/leagues/pages/leaguue-touurnaments-view";
import TournamentListingView from "@calcom/ee/leagues/pages/league-tournaments-view";

import type { CalPageWrapper } from "@components/PageWrapper";
import PageWrapper from "@components/PageWrapper";

const Page = TournamentListingView as CalPageWrapper;
Page.PageWrapper = PageWrapper;

export default Page;
