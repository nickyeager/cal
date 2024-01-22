import type { ColumnDef } from "@tanstack/react-table";
import { Shuffle, View } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useRef } from "react";

import { WEBAPP_URL } from "@calcom/lib/constants";
import type { MembershipRole } from "@calcom/prisma/enums";
import type { RouterOutputs } from "@calcom/trpc";
import { trpc } from "@calcom/trpc";
import { Avatar, Badge, Button, DataTable, Checkbox } from "@calcom/ui";

import { TournamentScheduleDialog } from "@components/dialog/TournamentScheduleDialog";

import { RoundRobinScheduleList } from "./RoundRobinScheduleList";

export interface User {
  id: number;
  username: string | null;
  email: string;
  timeZone: string;
  role: MembershipRole;
  accepted: boolean;
  disableImpersonation: boolean;
  completedOnboarding: boolean;
  teams: {
    id: number;
    name: string;
    slug: string | null;
  }[];
}

type Payload = {
  showModal: boolean;
  user?: User;
};

export type State = {
  changeMemberRole: Payload;
  deleteMember: Payload;
  impersonateMember: Payload;
  inviteMember: Payload;
  editSheet: Payload;
};

type Team = RouterOutputs["viewer"]["teams"]["get"];

interface PlayerRankingProps {
  team: Team | undefined;
  loading: boolean;
  schedule: any;
  isScheduleOpen: boolean;
  generateRoundRobin: any;
  openSchedule: boolean;
  setOpenSchedule: any;
}

export function PlayerRankingList(props: PlayerRankingProps) {
  const { data: session } = useSession();

  const { data: currentMembership } = trpc.viewer.organizations.listCurrent.useQuery();

  const { team, loading, schedule, generateRoundRobin, setOpenSchedule, openSchedule } = props;
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const adminOrOwner = currentMembership?.user.role === "ADMIN" || currentMembership?.user.role === "OWNER";
  const domain = WEBAPP_URL;
  const memorisedColumns = useMemo(() => {
    const cols: ColumnDef<User>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
      },
      {
        id: "member",
        accessorFn: (data) => data.email,
        header: "Member",
        cell: ({ row }) => {
          const { username, email } = row.original;
          return (
            <div className="flex items-center gap-2">
              <Avatar size="sm" alt={username || email} imageSrc={`${domain}/${username}/avatar.png`} />
              <div className="">
                <div className="text-emphasis text-sm font-medium leading-none">
                  {username || "No username"}
                </div>
                <div className="text-subtle mt-1 text-sm leading-none">{email}</div>
              </div>
            </div>
          );
        },
        filterFn: (rows, id, filterValue) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore Weird typing issue
          return rows.getValue(id).includes(filterValue);
        },
      },
      {
        id: "role",
        accessorFn: (data) => data.role,
        header: "Role",
        cell: ({ row, table }) => {
          const { role } = row.original;
          return (
            <Badge
              variant={role === "MEMBER" ? "gray" : "blue"}
              onClick={() => {
                table.getColumn("role")?.setFilterValue([role]);
              }}>
              {role}
            </Badge>
          );
        },
        filterFn: (rows, id, filterValue) => {
          return filterValue.includes(rows.getValue(id));
        },
      },
      {
        id: "teams",
        header: "Teams",
        cell: ({ row }) => {
          const { teams, accepted } = row.original;
          return (
            <div className="flex h-full flex-wrap items-center gap-2">
              {accepted ? null : (
                <Badge variant="red" className="text-xs">
                  Pending
                </Badge>
              )}
              {teams.map((team) => (
                <Badge key={team.id} variant="gray">
                  {team.name}
                </Badge>
              ))}
            </div>
          );
        },
      },
    ];

    return cols;
  }, [session?.user.id, adminOrOwner, domain]);

  const tournamentId = team.tournament.id;
  const teamId = team.id;

  const flatData = team?.members as User[];
  return (
    <>
      <DataTable
        searchKey="member"
        tableContainerRef={tableContainerRef}
        columns={memorisedColumns}
        data={flatData}
        isLoading={loading}
        tableCTA={
          <>
            <Button
              type="button"
              color="primary"
              StartIcon={View}
              size="sm"
              className="rounded-md"
              onClick={() => {
                setOpenSchedule(true);
              }}>
              View Schedule
            </Button>
            <Button
              type="button"
              color="primary"
              StartIcon={Shuffle}
              size="sm"
              className="rounded-md"
              onClick={generateRoundRobin}>
              Generate Round Robin Bracket
            </Button>
          </>
        }
      />
      <TournamentScheduleDialog
        isOpenDialog={openSchedule}
        setIsOpenDialog={setOpenSchedule}
        schedule={schedule}
        teamId={teamId}
        tournamentId={tournamentId}
      />
      {schedule && <RoundRobinScheduleList team={team} schedule={schedule} />}
    </>
  );
}
