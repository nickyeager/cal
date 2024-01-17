import { useState, useRef, useMemo, useCallback, useEffect, PropsWithChildren } from "react";

import { WEBAPP_URL } from "@calcom/lib/constants";
import { useDebounce } from "@calcom/lib/hooks/useDebounce";
import { RouterOutputs, trpc } from "@calcom/trpc/react";
import {
  Badge,
  ConfirmationDialogContent,
  Dialog,
  DropdownActions,
  showToast,
  Table,
  TextField,
  Avatar,
} from "@calcom/ui";
import { Edit, Trash, Lock } from "@calcom/ui/components/icon";
import CheckboxField from "@components/ui/form/CheckboxField";
import { PendingMember } from "~/ee/teams/lib/types";


const { Cell, ColumnTitle, Header, Row } = Table;

const FETCH_LIMIT = 25;

type TeamUsersTableInviteProps = PropsWithChildren<{
  selectedEmails?: string | string[];
  handleOnChecked: (usersEmail: string) => void;
  teamId: number;
  members?: PendingMember[];
}>;

function UsersTableBare( props: TeamUsersTableInviteProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { selectedEmails, handleOnChecked } = props;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);


  const { data, fetchNextPage, isFetching } = trpc.viewer.admin.listPaginated.useInfiniteQuery(
    {
      limit: FETCH_LIMIT,
      searchTerm: debouncedSearchTerm,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const sendPasswordResetEmail = trpc.viewer.admin.sendPasswordReset.useMutation({
    onSuccess: () => {
      showToast("Password reset email has been sent", "success");
    },
  });

  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = useMemo(() => data?.pages?.flatMap((page) => page.rows) ?? [], [data]);
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (scrollHeight - scrollTop - clientHeight < 300 && !isFetching && totalFetched < totalDBRowCount) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <>
      <TextField
        placeholder="username or email"
        label="Search"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div
        className="border-subtle rounded-md border"
        ref={tableContainerRef}
        onScroll={() => fetchMoreOnBottomReached()}
        style={{
          height: "calc(100vh - 30vh)",
          overflow: "auto",
        }}>
        <Table>
          <Header>
            <ColumnTitle widthClassNames="w-auto"></ColumnTitle>
            <ColumnTitle widthClassNames="w-auto">User</ColumnTitle>
            <ColumnTitle>Role</ColumnTitle>
          </Header>
          <tbody className="divide-subtle divide-y rounded-md">
            {flatData.map((user) => (
              <Row key={user.email}>
                <Cell widthClassNames="w-auto">
                  {!props.members?.some((member) => member.id === user.id) && (
                    <div key={user.id} className="flex items-center px-4 py-1.5">
                      <CheckboxField
                        checked={Array.isArray(selectedEmails)
                          ? selectedEmails.includes(user.email)
                          : selectedEmails === user.email}
                        onChange={() => handleOnChecked(user.email)}
                        description={"Invite User"}
                      />
                    </div>
                  )}
                </Cell>
                <Cell widthClassNames="w-auto">
                  <div className="min-h-10 flex ">
                    <Avatar
                      size="md"
                      alt={`Avatar of ${user.username || "Nameless"}`}
                      imageSrc={`${WEBAPP_URL}/${user.username}/avatar.png?orgId=${user.organizationId}`}
                    />

                    <div className="text-subtle ml-4 font-medium">
                      <span className="text-default">{user.name}</span>
                      <span className="ml-3">/{user.username}</span>
                      <br />
                      <span className="break-all">{user.email}</span>
                    </div>
                  </div>
                </Cell>
                <Cell>
                  <div className="flex items-center">
                    <Badge className="capitalize" variant={user.role === "ADMIN" ? "red" : "gray"}>
                      {user.role.toLowerCase()}
                    </Badge>

                    {props.members?.some((member) => member.id === user.id) && (
                      <Badge className="ml-2" variant="green">
                        Team Member
                      </Badge>
                    )}
                  </div>
                </Cell>

              </Row>
            ))}
          </tbody>
        </Table>

      </div>
    </>
  );
}

export const TeamUsersTableInvite = UsersTableBare;
