import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useOrgBranding } from "@calcom/features/ee/organizations/context/provider";
import InviteLinkSettingsModal from "@calcom/features/ee/teams/components/InviteLinkSettingsModal";
import MemberInvitationModal from "@calcom/features/ee/tournaments/components/MemberInvitationModal";
import { classNames } from "@calcom/lib";
import { APP_NAME, WEBAPP_URL } from "@calcom/lib/constants";
import { useBookerUrl } from "@calcom/lib/hooks/useBookerUrl";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { MembershipRole } from "@calcom/prisma/enums";
import type { RouterOutputs } from "@calcom/trpc/react";
import { trpc } from "@calcom/trpc/react";
import {
  Avatar,
  Badge,
  Button,
  showToast,
  SkeletonButton,
  SkeletonContainer,
  SkeletonText,
} from "@calcom/ui";
import { ArrowRight, Plus, Trash2 } from "@calcom/ui/components/icon";

type TournamentMember = RouterOutputs["viewer"]["tournaments"]["get"]["members"][number];

type FormValues = {
  members: TournamentMember[];
};

const AddNewTournamentParticipants = () => {
  const searchParams = useSearchParams();
  const session = useSession();
  const tournamentId = searchParams?.get("id") ? Number(searchParams.get("id")) : -1;
  console.log(tournamentId);
  console.log("tournamentQuery");
  const tournamentQuery = trpc.viewer.tournaments.get.useQuery(
    { tournamentId },
    { enabled: session.status === "authenticated" }
  );
  if (session.status === "loading" || !tournamentQuery.data) return <AddNewTournamentParticipantsSkeleton />;

  return (
    <AddNewTournamentParticipantsForm
      defaultValues={{ members: tournamentQuery.data.members }}
      tournamentId={tournamentId}
    />
  );
};

export const AddNewTournamentParticipantsForm = ({
  defaultValues,
  tournamentId,
}: {
  defaultValues: FormValues;
  tournamentId: number;
}) => {
  const searchParams = useSearchParams();
  const { t, i18n } = useLocale();

  const router = useRouter();
  const utils = trpc.useContext();
  const orgBranding = useOrgBranding();

  const showDialog = searchParams?.get("inviteModal") === "true";
  const [memberInviteModal, setMemberInviteModal] = useState(showDialog);
  const [inviteLinkSettingsModal, setInviteLinkSettingsModal] = useState(false);

  const { data: tournament, isLoading } = trpc.viewer.tournaments.get.useQuery(
    { tournamentId },
    { enabled: !!tournamentId }
  );
  const { data: orgMembersNotInThisTournament } = trpc.viewer.tournaments.getMembers.useQuery(
    {
      tournamentIdToExclude: tournamentId,
      distinctUser: true,
    },
    {
      enabled: orgBranding !== null,
    }
  );

  const inviteMemberMutation = trpc.viewer.tournaments.inviteMember.useMutation();

  const publishTournamentMutation = trpc.viewer.tournaments.publish.useMutation({
    onSuccess(data) {
      router.push(data.url);
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  return (
    <>
      <div>
        {defaultValues.members.length > 0 && (
          <ul className="border-subtle rounded-md border" data-testid="pending-member-list">
            {defaultValues.members.map((member, index) => (
              <PendingParticipantItem
                key={member.email}
                member={member}
                index={index}
                tournamentId={tournamentId}
              />
            ))}
          </ul>
        )}
        <Button
          color="secondary"
          data-testid="new-member-button"
          StartIcon={Plus}
          onClick={() => setMemberInviteModal(true)}
          className={classNames("w-full justify-center", defaultValues.members.length > 0 && "mt-6")}>
          Add Tournament Member
        </Button>
      </div>
      {isLoading ? (
        <SkeletonButton />
      ) : (
        <>
          <MemberInvitationModal
            isLoading={inviteMemberMutation.isLoading}
            isOpen={memberInviteModal}
            orgMembers={orgMembersNotInThisTournament}
            tournamentId={tournamentId}
            token={tournament?.inviteToken?.token}
            onExit={() => setMemberInviteModal(false)}
            onSubmit={(values, resetFields) => {
              inviteMemberMutation.mutate(
                {
                  tournamentId,
                  language: i18n.language,
                  role: values.role,
                  usernameOrEmail: values.emailOrUsername,
                  sendEmailInvitation: values.sendInviteEmail,
                },
                {
                  onSuccess: async (data) => {
                    await utils.viewer.tournaments.get.invalidate();
                    setMemberInviteModal(false);
                    if (data.sendEmailInvitation) {
                      if (Array.isArray(data.usernameOrEmail)) {
                        showToast(
                          t("email_invite_team_bulk", {
                            userCount: data.usernameOrEmail.length,
                          }),
                          "success"
                        );
                        resetFields();
                      } else {
                        showToast(
                          t("email_invite_team", {
                            email: data.usernameOrEmail,
                          }),
                          "success"
                        );
                      }
                    }
                  },
                  onError: (error) => {
                    showToast(error.message, "error");
                  },
                }
              );
            }}
            onSettingsOpen={() => {
              setMemberInviteModal(false);
              setInviteLinkSettingsModal(true);
            }}
            members={defaultValues.members}
          />
          {tournament?.inviteToken && (
            <InviteLinkSettingsModal
              isOpen={inviteLinkSettingsModal}
              teamId={tournament.id}
              token={tournament.inviteToken?.token}
              expiresInDays={tournament.inviteToken?.expiresInDays || undefined}
              onExit={() => {
                setInviteLinkSettingsModal(false);
                setMemberInviteModal(true);
              }}
            />
          )}
        </>
      )}
      <hr className="border-subtle my-6" />
      <Button
        EndIcon={!orgBranding ? ArrowRight : undefined}
        color="primary"
        className="w-full justify-center"
        disabled={publishTournamentMutation.isLoading}
        onClick={() => {
          if (orgBranding) {
            router.push("/settings/teams");
          } else {
            publishTournamentMutation.mutate({ tournamentId });
          }
        }}>
        {t(orgBranding ? "finish" : "team_publish")}
      </Button>
    </>
  );
};

export default AddNewTournamentParticipants;

const AddNewTournamentParticipantsSkeleton = () => {
  return (
    <SkeletonContainer className="border-subtle rounded-md border">
      <div className="flex w-full justify-between p-4">
        <div>
          <p className="text-emphasis text-sm font-medium">
            <SkeletonText className="h-4 w-56" />
          </p>
          <div className="mt-2.5 w-max">
            <SkeletonText className="h-5 w-28" />
          </div>
        </div>
      </div>
    </SkeletonContainer>
  );
};

const PendingParticipantItem = (props: { member: TournamentMember; index: number; tournamentId: number }) => {
  const { member, index, tournamentId } = props;
  const { t } = useLocale();
  const utils = trpc.useContext();
  const session = useSession();
  const bookerUrl = useBookerUrl();
  const { data: currentOrg } = trpc.viewer.organizations.listCurrent.useQuery(undefined, {
    enabled: !!session.data?.user?.org,
  });
  const removeMemberMutation = trpc.viewer.tournaments.removeMember.useMutation({
    async onSuccess() {
      await utils.viewer.tournaments.get.invalidate();
      await utils.viewer.eventTypes.invalidate();
      showToast(t("member_removed"), "success");
    },
    async onError(err) {
      showToast(err.message, "error");
    },
  });

  const isOrgAdminOrOwner =
    currentOrg &&
    (currentOrg.user.role === MembershipRole.OWNER || currentOrg.user.role === MembershipRole.ADMIN);

  return (
    <li
      key={member.email}
      className={classNames(
        "flex items-center justify-between p-6 text-sm",
        index !== 0 && "border-subtle border-t"
      )}
      data-testid="pending-member-item">
      <div className="mr-4 flex max-w-full space-x-2 overflow-hidden rtl:space-x-reverse">
        <Avatar size="mdLg" imageSrc={`${bookerUrl}/${member.username}/avatar.png`} alt="owner-avatar" />
        <div className="max-w-full overflow-hidden">
          <div className="flex space-x-1">
            <p>{member.name || member.email || t("team_member")}</p>
            {/* Assume that the first member of the team is the creator */}
            {member.id === session.data?.user.id && <Badge variant="green">{t("you")}</Badge>}
            {!member.accepted && <Badge variant="orange">{t("pending")}</Badge>}
            {member.role === "MEMBER" && <Badge variant="gray">{t("member")}</Badge>}
            {member.role === "ADMIN" && <Badge variant="default">{t("admin")}</Badge>}
          </div>
          {member.username ? (
            <p className="text-default truncate">{`${WEBAPP_URL}/${member.username}`}</p>
          ) : (
            <p className="text-default truncate">{t("not_on_cal", { appName: APP_NAME })}</p>
          )}
        </div>
      </div>
      {(member.role !== "OWNER" || isOrgAdminOrOwner) && (
        <Button
          data-testid="remove-member-button"
          StartIcon={Trash2}
          variant="icon"
          color="secondary"
          className="h-[36px] w-[36px]"
          onClick={() => {
            removeMemberMutation.mutate({
              tournamentId: tournamentId,
              memberId: member.id,
            });
          }}
        />
      )}
    </li>
  );
};
