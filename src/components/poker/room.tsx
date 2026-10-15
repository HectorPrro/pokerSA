import { Lobby } from "./lobby";
import { TableView } from "./table-view";
import { useRoom } from "@/poker/use-room";

export function Room() {
  const room = useRoom();

  if (!room.hydrated) {
    return (
      <main className="room grid min-h-dvh place-items-center">
        <p className="font-display text-3xl text-gold">RÍO</p>
      </main>
    );
  }

  if (room.table && room.stake) {
    return (
      <TableView
        table={room.table}
        stake={room.stake}
        save={room.save}
        clock={room.clock}
        onAct={room.act}
        onLeave={room.leave}
        onNext={room.nextHand}
        onRebuy={room.rebuy}
        onToggleSound={room.toggleSound}
      />
    );
  }

  return (
    <Lobby
      save={room.save}
      onName={room.setName}
      onSit={room.sit}
      onReload={room.reload}
      onToggleSound={room.toggleSound}
    />
  );
}
