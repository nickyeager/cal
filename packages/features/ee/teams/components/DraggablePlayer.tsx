import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DraggablePlayer = ({ player, roundIndex, matchIndex, playerIndex }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `round-${roundIndex}-match-${matchIndex}-player-${playerIndex}` });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {player}
    </div>
  );
}

export default DraggablePlayer;
