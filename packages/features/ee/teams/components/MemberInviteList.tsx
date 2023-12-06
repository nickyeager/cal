import { useState, useRef, useMemo, useCallback, useEffect } from "react";

import { WEBAPP_URL } from "@calcom/lib/constants";
import { useDebounce } from "@calcom/lib/hooks/useDebounce";
import { trpc } from "@calcom/trpc/react";
import { Badge, DropdownActions, showToast, Table, TextField, Avatar } from "@calcom/ui";
import { Edit } from "@calcom/ui/components/icon";

const { Cell, ColumnTitle, Header, Row } = Table;

const FETCH_LIMIT = 25;

interface MemberInviteListProps {
  team: Team | undefined;
}

export default function MemberInviteList(props: MemberInviteListProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const mutation = trpc.viewer.users.delete.useMutation({
    onSuccess: async () => {
      showToast("User has been deleted", "success");
      // Lets not invalidated the whole cache, just remove the user from the cache.
      // usefull cause in prod this will be fetching 100k+ users
      // FIXME: Tested locally and it doesnt't work, need to investigate
      utils.viewer.admin.listPaginated.setInfiniteData({ limit: FETCH_LIMIT }, (cachedData) => {
        if (!cachedData) {
          return {
            pages: [],
            pageParams: [],
          };
        }
        return {
          ...cachedData,
          pages: cachedData.pages.map((page) => ({
            ...page,
            rows: page.rows.filter((row) => row.id !== userToDelete),
          })),
        };
      });
    },
    onError: (err) => {
      console.error(err.message);
      showToast("There has been an error deleting this user.", "error");
    },
    onSettled: () => {
      setUserToDelete(null);
    },
  });

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

  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const currentMembers = props.team?.members;

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
            <ColumnTitle widthClassNames="w-auto">User</ColumnTitle>
            <ColumnTitle>Timezone</ColumnTitle>
            <ColumnTitle>Role</ColumnTitle>
            <ColumnTitle widthClassNames="w-auto">
              <span className="sr-only">Edit</span>
            </ColumnTitle>
          </Header>

          <tbody className="divide-subtle divide-y rounded-md">
            {flatData.map((user) => (
              <Row key={user.email}>
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
                <Cell>{user.timeZone}</Cell>
                <Cell>
                  <Badge className="capitalize" variant={user.role === "ADMIN" ? "red" : "gray"}>
                    {user.role.toLowerCase()}
                  </Badge>
                </Cell>
                <Cell widthClassNames="w-auto">
                  <div className="flex w-full justify-end">
                    <DropdownActions
                      actions={[
                        {
                          id: "edit",
                          label: "Edit",
                          href: `/settings/admin/users/${user.id}/edit`,
                          icon: Edit,
                        },
                      ]}
                    />
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
