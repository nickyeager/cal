// import { useState } from "react";
//
// import { useLocale } from "@calcom/lib/hooks/useLocale";
// import type { RouterOutputs } from "@calcom/trpc/react";
// import { trpc } from "@calcom/trpc/react";
// import { Card, showToast } from "@calcom/ui";
// import { UserPlusx`, Users, Edit } from "@calcom/ui/components/icon";
//
// import LeagueListItem from "./TeamListItem";
//
// interface Props {
//   tournaments: RouterOutputs["viewer"]["leagues"]["tournaments"];
//   pending?: boolean;
// }
//
// export default function TournamentList(props: Props) {
//   const utils = trpc.useContext();
//
//   const { t } = useLocale();
//
//   const [hideDropdown, setHideDropdown] = useState(false);
//
//   function selectAction(action: string, teamId: number) {
//     switch (action) {
//       case "disband":
//         deleteTournament(teamId);
//         break;
//     }
//   }
//
//   const deleteTournamentMutation = trpc.viewer.tournaments.delete.useMutation({
//     async onSuccess() {
//       await utils.viewer.tournaments.list.invalidate();
//     },
//     async onError(err) {
//       showToast(err.message, "error");
//     },
//   });
//
//   function deleteTournament(teamId: number) {
//     deleteTournamentMutation.mutate({ teamId });
//   }
//
//   return (
//     <ul className="bg-default divide-subtle border-subtle mb-2 divide-y overflow-hidden rounded-md border">
//       {props.tournaments.map((tournament) => (
//         <LeagueListItem
//           key={tournament?.id as number}
//           team={tournament}
//           onActionSelect={(action: string) => selectAction(action, tournament?.id as number)}
//           isLoading={deleteTournamentMutation.isLoading}
//           hideDropdown={hideDropdown}
//           setHideDropdown={setHideDropdown}
//         />
//       ))}
//
//       {/* only show recommended steps when there is only one team */}
//       {!props.pending && props.tournaments.length === 1 && (
//         <>
//           {props.tournaments.map(
//             (tournament, i) =>
//               tournament.role !== "MEMBER" &&
//               i === 0 && (
//                 <div className="bg-subtle p-6">
//
//                   <div className="grid-col-1 grid gap-2 md:grid-cols-3">
//
//                   </div>
//                 </div>
//               )
//           )}
//         </>
//       )}
//     </ul>
//   );
// }
