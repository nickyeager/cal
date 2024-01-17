import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import Match from "@calcom/features/ee/teams/components/Match";
import DraggablePlayer from "@calcom/features/ee/teams/components/DraggablePlayer";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader, Divider,
  showToast,
  TextArea
} from "@calcom/ui";
import useCurrentUserId from "@lib/hooks/useCurrentUserId";

interface ITournamentScheduleDialog {
  isOpenDialog: boolean;
  setIsOpenDialog: Dispatch<SetStateAction<boolean>>;
  schedule: any;
  tournamentId: number;
  teamId: number;
}

export const TournamentScheduleDialog = (props: ITournamentScheduleDialog) => {
  //const { t } = useLocale();
  //const utils = trpc.useContext();
  const { isOpenDialog, setIsOpenDialog, schedule, tournamentId, teamId } = props;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  const currentUserId = useCurrentUserId();
  const [localSchedule, setLocalSchedule] = useState(schedule);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Extract round, match, and player indices from the ids
    const [activeRound, activeMatch, activePlayer] = active.id.split("-").slice(1).map(Number);
    const [overRound, overMatch, overPlayer] = over.id.split("-").slice(1).map(Number);

    // Implement logic to update the schedule
    let newSchedule = [...localSchedule];

    // Example logic: swap players between matches
    // Note: This is a simplified logic. You might need more complex handling depending on your data structure.
    const activePlayerData = newSchedule[activeRound][activeMatch][activePlayer];
    newSchedule[activeRound][activeMatch][activePlayer] = newSchedule[overRound][overMatch][overPlayer];
    newSchedule[overRound][overMatch][overPlayer] = activePlayerData;

    setLocalSchedule(newSchedule);
  };

  const updateSchedule = trpc.viewer.teams.createSchedule.useMutation({
    onSuccess: () => {
      console.log('onSuccess');
      setIsOpenDialog(false);
      showToast("Matches set", "success");
    },
    onError: (e) => {
      console.log(e);
      console.log('onError');
      showToast("Charge successful", "error");
    },
  });

  return (
    <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <DialogContent enableOverflow>
          <div className="space-x-3">
            <div className="pt-1">
              <DialogHeader title={"Schedules"} />
              <p className="text-subtle text-sm">The current generated schedule</p>

              {schedule.length > 0 && (
                <div>
                  <span className="text-emphasis mb-2 mt-6 text-sm font-bold">Round Robin Schedule for Doubles</span>
                  <ol>
                    {schedule.map((round: any[], roundIndex: number) => (
                      <li key={`round-${roundIndex}`}>
                        <h3 className="text-emphasis font-bold">Round {roundIndex + 1}</h3>
                        <SortableContext key={`round-${roundIndex}`} items={round.flatMap((match, matchIndex) => [`round-${roundIndex}-match-${matchIndex}-player-0`, `round-${roundIndex}-match-${matchIndex}-player-1`])} strategy={verticalListSortingStrategy}>
                          {round.map((match, matchIndex) => (
                            <div key={`round-${roundIndex}-match-${matchIndex}`}>
                                <DraggablePlayer player={match.home.name} roundIndex={roundIndex} matchIndex={matchIndex} playerIndex={0} />
                                <DraggablePlayer player={match.away.name} roundIndex={roundIndex} matchIndex={matchIndex} playerIndex={1} />
                              <p className="text-center">vs</p>
                            </div>
                          ))}
                        </SortableContext>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              <DialogFooter>
                <DialogClose />
                <Button
                  data-testid="create_update_schedule"
                  disabled={updateSchedule.isLoading}
                  onClick={() =>
                    updateSchedule.mutate({
                      tournamentId: tournamentId,
                      schedule: schedule,
                      memberId: currentUserId,
                      teamId: currentUserId,
                    })
                  }>
                  Set Matches
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </DndContext>
    </Dialog>
  );
};
