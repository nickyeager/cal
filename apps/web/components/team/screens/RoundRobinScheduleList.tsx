import { useSession } from "next-auth/react";

import type { RouterOutputs } from "@calcom/trpc";
import { Card } from "@calcom/ui";
import { UserPlus } from "@calcom/ui/components/icon";

type Team = RouterOutputs["viewer"]["teams"]["get"];

interface PlayerRankingProps {
  team: Team | undefined;
  schedule: any;
  loading: boolean;
}

export function RoundRobinScheduleList(props: PlayerRankingProps) {
  const { data: session } = useSession();

  const { team, loading, schedule } = props;

  return (
    <>
      {schedule.length > 0 && (
        <div>
          <span className="text-emphasis mb-2 mt-6 text-sm font-bold">Round Robin Schedule for Doubles</span>
          <ol>
            {schedule.map((round: any[], roundIndex: number) => (
              <li key={`round-${roundIndex}`}>
                <h3 className="text-emphasis font-bold">Round {roundIndex + 1}</h3>

                {round.map((match, matchIndex) => (
                  <Card
                    key={`round-${roundIndex}-match-${matchIndex}`}
                    icon={<UserPlus className="h-5 w-5 text-green-700" />}
                    variant="basic"
                    description={`${match.home.name}vs.${match.away.name}`}
                  />
                ))}
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}
