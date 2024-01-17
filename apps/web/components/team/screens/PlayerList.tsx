import Link from "next/link";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { useRouterQuery } from "@calcom/lib/hooks/useRouterQuery";
import type { TeamWithMembers } from "@calcom/lib/server/queries/teams";
import { Avatar } from "@calcom/ui";
import TeamPill, { TeamRole } from "@calcom/ee/teams/components/TeamPill";
import { InviteMemberModal } from "@calcom/features/users/components/UserTable/InviteMemberModal";
import { Dispatch } from "react";
import { Action, State } from "@calcom/features/users/components/UserTable/UserListTable";

type TeamType = Omit<NonNullable<TeamWithMembers>, "inviteToken">;
type MembersType = TeamType["members"];
type MemberType = Pick<MembersType[number], "id" | "name" | "bio" | "username"> & { safeBio: string | null };

const MemberItem = ({ member }) => {
  const { t } = useLocale();

  const routerQuery = useRouterQuery();
  // We don't want to forward orgSlug and user which are route params to the next route
  const { slug: _slug, orgSlug: _orgSlug, user: _user, ...queryParamsToForward } = routerQuery;
  return (
    <li className="divide-subtle divide-y px-5">
      <div className="my-4 flex justify-between">
        <div className="flex w-full flex-col justify-between overflow-hidden sm:flex-row">
          <div className="flex">
            <Link key={member.id} href={{ pathname: `/${member.username}`, query: queryParamsToForward }}>
              <div className="flex items-center space-x-4">
                <Avatar size="md" alt={member.name} imageSrc={member.avatarUrl} />
                <div>
                  <p className="text-white font-semibold">{member.name}</p>
                  <p className="text-gray-400">{member.username}</p>
                </div>
                <div className="mb-1 flex">
                  {!member.accepted && <TeamPill color="orange" text={t("pending")} />}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
};

const TeamList = ({ teamMembers }) => {
  return (
    <ul className="divide-subtle border-subtle divide-y rounded-md border ">
      {teamMembers.map((member) => (
        <MemberItem key={member.id} member={member} />
      ))}
    </ul>
  );
};

const PlayerList = ({ members }: { members: MemberType[]; }) => {
  return (
      <TeamList teamMembers={members} />
  );
};

export default PlayerList;
