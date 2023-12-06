import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { useParamsWithFallback } from "@calcom/lib/hooks/useParamsWithFallback";
import type { RouterOutputs } from "@calcom/trpc/react";
import { trpc } from "@calcom/trpc/react";
import { Meta } from "@calcom/ui";
import { List } from "@calcom/ui";

import { getLayout } from "../../../settings/layouts/SettingsLayout";

type Tournament = RouterOutputs["viewer"]["tournaments"]["get"];

interface TournamentListProps {
  tournament: Tournament | undefined;
}

const TournamentListingView = () => {
  const searchParams = useSearchParams();
  const { t, i18n } = useLocale();

  const router = useRouter();
  const session = useSession();

  const utils = trpc.useContext();
  const params = useParamsWithFallback();

  const tournamentId = Number(params.id);

  const [showTournamentInvitationModal, setShowTournamentInvitationModal] = useState(showDialog);
  const [showInviteLinkSettingsModal, setInviteLinkSettingsModal] = useState(false);
  const { data: currentOrg } = trpc.viewer.organizations.listCurrent.useQuery(undefined, {
    enabled: !!session.data?.user?.organizationId,
  });

  // const { data: orgMembersNotInThisTeam, isLoading: isOrgListLoading } =
  //   trpc.viewer.organizations.getMembers.useQuery(
  //     {
  //       teamIdToExclude: tournamentId,
  //       distinctUser: true,
  //     },
  //     {
  //       enabled: searchParams !== null,
  //     }
  //   );

  // const { data: team, isLoading: isTeamsLoading } = trpc.viewer.teams.get.useQuery(
  //   { teamId },
  //   {
  //     onError: () => {
  //       router.push("/settings");
  //     },
  //   }
  // );
  return (
    <>
      <Meta title="Tournaments" description="The tournaments" />
      <List />
    </>
  );
};

TournamentListingView.getLayout = getLayout;

export default TournamentListingView;
