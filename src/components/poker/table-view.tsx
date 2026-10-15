import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { chips, preflopLabel } from "@/poker/cards";
import { describeHolding } from "@/poker/eval";
import {
  displayPot,
  heroSeat,
  legalActions,
  positionOf,
  potTotal,
  type Act,
  type Table,
} from "@/poker/engine";
import { REGULARS, type Save, type Stake } from "@/poker/stakes";
import { Chip, PlayingCard } from "./bits";

const POS = [
  { left: "50%", top: "90%" },
  { left: "7%", top: "72%" },
  { left: "9%", top: "26%" },
  { left: "50%", top: "9%" },
  { left: "91%", top: "26%" },
  { left: "93%", top: "72%" },
];

const BET_AT = [
  "-top-8 left-1/2 -translate-x-1/2",
  "-right-2 top-1/2 translate-x-full -translate-y-1/2",
  "-right-2 top-1/2 translate-x-full -translate-y-1/2",
  "-bottom-8 left-1/2 -translate-x-1/2",
  "-left-2 top-1/2 -translate-x-full -translate-y-1/2",
  "-left-2 top-1/2 -translate-x-full -translate-y-1/2",
];

const STREET: Record<string, string> = {
  preflop: "Preflop",
  flop: "Flop",
  turn: "Turn",
  river: "Río",
};

export function TableView({
  table,
  stake,
  save,
  clock,
  onAct,
  onLeave,
  onNext,
  onRebuy,
  onToggleSound,
}: {
  table: Table;
  stake: Stake;
  save: Save;
  clock: number;
  onAct: (action: Act) => void;
  onLeave: () => void;
  onNext: () => void;
  onRebuy: (amount: number) => void;
  onToggleSound: () => void;
}) {
  const hero = heroSeat(table);
  const legal = table.toAct === hero.seat ? legalActions(table, hero.seat) : null;
  const yourTurn = Boolean(legal && table.phase === "betting");
  const [raising, setRaising] = useState(false);
  const [raiseTo, setRaiseTo] = useState(0);
  const [logOpen, setLogOpen] = useState(false);

  useEffect(() => {
    setRaising(false);
  }, [table.handNo, table.street, table.toAct]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!yourTurn || !legal) return;
      const key = event.key.toLowerCase();
      if (key === "f" && legal.fold) onAct({ kind: "fold" });
      if (key === "c" || key === " ") {
        event.preventDefault();
        if (legal.check) onAct({ kind: "check" });
        else if (legal.call > 0) onAct({ kind: "call" });
      }
      if (key === "r" && legal.minRaise != null) {
        setRaiseTo(legal.minRaise);
        setRaising(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [yourTurn, legal, onAct]);

  const actor = table.toAct == null ? null : table.seats[table.toAct];
  const hole = hero.hole;
  const made = hole ? (table.board.length >= 3 ? describeHolding(hole, table.board) : preflopLabel(hole[0], hole[1])) : "";
  const toCall = legal?.call ?? 0;
  const potNow = table.phase === "betting" ? potTotal(table) : displayPot(table);
  const odds = toCall > 0 ? (potNow + toCall) / toCall : 0;
  const need = toCall > 0 ? Math.round((100 * toCall) / (potNow + toCall)) : 0;
  const cap = Math.min(stake.max, save.bankroll);
  const [rebuy, setRebuy] = useState(cap);

  useEffect(() => {
    setRebuy(Math.min(stake.max, Math.max(stake.min, save.bankroll)));
  }, [save.bankroll, stake]);

  const openRaise = () => {
    if (!legal?.minRaise) return;
    setRaiseTo(legal.minRaise);
    setRaising(true);
  };

  return (
    <main className="room flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-2 px-3 py-3 md:px-5">
        <div className="min-w-0">
          <p className="font-display text-xl text-gold">RÍO</p>
          <p className="truncate text-sm text-muted">
            {stake.name} · {chips(stake.sb)}/{chips(stake.bb)} · Mano {table.handNo}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="hidden text-sm tabular-nums text-muted sm:block">Banco {chips(save.bankroll)}</p>
          <button type="button" className="btn btn-ghost min-h-11 px-3" onClick={onToggleSound} aria-label="Sonido">
            {save.sound ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
          </button>
          <button type="button" className="btn min-h-11" onClick={onLeave}>
            Levantarse
          </button>
        </div>
      </header>

      <div className="felt-wrap">
        <div className="felt">
          <div className="pointer-events-none absolute top-1/2 left-1/2 flex w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
            <p className="text-xs tracking-widest text-gold">{STREET[table.street]}</p>
            <p className="text-xs tracking-widest text-muted">BOTE</p>
            <p className="font-display text-3xl leading-none tabular-nums md:text-5xl">{chips(displayPot(table))}</p>
            <div className="board flex min-h-12 items-center justify-center gap-1">
              {table.board.map((card) => (
                <PlayingCard key={`${table.handNo}-${card.r}${card.s}`} card={card} />
              ))}
            </div>
            <p className="max-w-xs text-center text-sm" aria-live="polite">
              {table.banner || (actor && !actor.isHero ? `${actor.name} piensa` : yourTurn ? "Te toca" : "")}
            </p>
          </div>

          {table.seats.map((seat) => {
            if (seat.sittingOut && seat.stack <= 0 && !seat.isHero) return null;
            const win = table.winners.find((w) => w.seat === seat.seat && w.net > 0);
            const show = table.showCards && seat.hole && !seat.folded;
            const tag = REGULARS.find((r) => r.name === seat.name)?.tag;
            const pos = positionOf(table, seat.seat);
            return (
              <div key={seat.seat} className="seat" style={{ left: POS[seat.seat]!.left, top: POS[seat.seat]!.top }}>
                <div className="relative">
                  {seat.bet > 0 && (
                    <div className={`absolute ${BET_AT[seat.seat]}`}>
                      <Chip amount={seat.bet} />
                    </div>
                  )}
                  {seat.seat === table.button && (
                    <div className="absolute -top-3 -left-3">
                      <span className="dealer">D</span>
                    </div>
                  )}
                  <div
                    className={`plate ${table.toAct === seat.seat ? "plate-turn" : ""} ${win ? "plate-win" : ""} ${seat.folded ? "opacity-45" : ""}`}
                  >
                    {!seat.isHero && seat.hole && (
                      <div className="mb-1 flex justify-center gap-0.5">
                        <PlayingCard card={show ? seat.hole[0] : null} down={!show} small />
                        <PlayingCard card={show ? seat.hole[1] : null} down={!show} small />
                      </div>
                    )}
                    <p className="truncate text-sm font-semibold">
                      {seat.name}
                      {seat.isHero ? " · tú" : ""}
                    </p>
                    <p className="text-xs text-muted">
                      {tag && !seat.isHero ? `${tag} · ` : ""}
                      {pos === "SB" || pos === "BB" ? pos : ""}
                    </p>
                    <p className="tabular-nums text-gold">{chips(seat.stack)}</p>
                    <p className="min-h-4 text-xs text-muted">{seat.allIn ? "All-in" : seat.lastAct}</p>
                    {win && <p className="text-sm font-semibold tabular-nums text-gold">+{chips(win.net)}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl justify-end px-3">
        <button type="button" className="text-sm text-muted" onClick={() => setLogOpen((v) => !v)}>
          {logOpen ? "Ocultar mano" : "Ver mano"}
        </button>
      </div>
      {logOpen && (
        <ol className="mx-auto mb-2 max-h-28 w-full max-w-3xl overflow-auto px-4 text-sm text-muted">
          {table.log.map((line, index) => (
            <li key={`${index}-${line}`}>{line}</li>
          ))}
        </ol>
      )}

      <footer className="dock mx-auto w-full max-w-3xl">
        {yourTurn && (
          <div
            className="mb-3 h-1 overflow-hidden rounded-full bg-line"
            aria-label={`Tiempo ${clock} segundos`}
          >
            <div className="h-full bg-gold" style={{ width: `${(clock / 20) * 100}%` }} />
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex gap-1">
            {hole ? (
              <>
                <PlayingCard card={hole[0]} large />
                <PlayingCard card={hole[1]} large />
              </>
            ) : (
              <>
                <PlayingCard down large />
                <PlayingCard down large />
              </>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xl">{made || "Sin cartas"}</p>
            <p className="text-sm tabular-nums text-muted">Stack {chips(hero.stack)}</p>
            {toCall > 0 && (
              <p className="text-sm text-muted">
                Cuota {odds.toFixed(1)} a 1 · hace falta {need}%
              </p>
            )}
          </div>
        </div>

        {table.phase === "bust" ? (
          <div className="mt-3">
            <p className="mb-2 text-sm">Te quedaste sin fichas en esta mesa.</p>
            {save.bankroll >= stake.min ? (
              <>
                <input
                  className="w-full accent-gold"
                  type="range"
                  min={stake.min}
                  max={cap}
                  step={stake.bb}
                  value={Math.min(cap, Math.max(stake.min, rebuy))}
                  aria-label="Recompra"
                  onChange={(event) => setRebuy(Number(event.target.value))}
                />
                <button
                  type="button"
                  className="btn btn-gold mt-3 w-full"
                  onClick={() => onRebuy(Math.min(cap, Math.max(stake.min, rebuy)))}
                >
                  Recomprar {chips(Math.min(cap, Math.max(stake.min, rebuy)))}
                </button>
              </>
            ) : (
              <p className="text-sm text-muted">No te alcanza el banco. Levántate y pide la recarga de cortesía.</p>
            )}
          </div>
        ) : table.phase === "between" ? (
          <button type="button" className="btn btn-gold mt-3 w-full" onClick={onNext}>
            Siguiente mano
          </button>
        ) : (
          <>
            {raising && legal?.minRaise != null && legal.maxRaise != null && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {presets(table, hero.seat).map((item) => (
                    <button key={item.label} type="button" className="btn min-h-11 px-3" onClick={() => setRaiseTo(item.to)}>
                      {item.label}
                    </button>
                  ))}
                </div>
                <input
                  className="mt-3 w-full accent-gold"
                  type="range"
                  min={legal.minRaise}
                  max={legal.maxRaise}
                  step={1}
                  value={Math.min(legal.maxRaise, Math.max(legal.minRaise, raiseTo))}
                  aria-label="Tamaño de la subida"
                  onChange={(event) => setRaiseTo(Number(event.target.value))}
                />
                <button
                  type="button"
                  className="btn btn-gold mt-3 w-full"
                  onClick={() => {
                    onAct({ kind: "raise", to: Math.min(legal.maxRaise!, Math.max(legal.minRaise!, raiseTo)) });
                    setRaising(false);
                  }}
                >
                  Subir a {chips(Math.min(legal.maxRaise, Math.max(legal.minRaise, raiseTo)))}
                </button>
              </div>
            )}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button type="button" className="btn text-sm" disabled={!yourTurn || !legal?.fold} onClick={() => onAct({ kind: "fold" })}>
                No ir
              </button>
              <button
                type="button"
                className="btn text-sm"
                disabled={!yourTurn || (!legal?.check && !(legal && legal.call > 0))}
                onClick={() => (legal?.check ? onAct({ kind: "check" }) : onAct({ kind: "call" }))}
              >
                {legal?.check ? "Pasar" : legal && legal.call > 0 ? `Igualar ${chips(legal.call)}` : "Igualar"}
              </button>
              <button
                type="button"
                className="btn btn-gold text-sm"
                disabled={!yourTurn || legal?.minRaise == null}
                onClick={() => {
                  if (!legal?.minRaise || legal.maxRaise == null) return;
                  if (legal.minRaise === legal.maxRaise) onAct({ kind: "raise", to: legal.maxRaise });
                  else openRaise();
                }}
              >
                {legal?.minRaise != null && legal.minRaise === legal.maxRaise
                  ? `All-in ${chips(legal.maxRaise)}`
                  : table.currentBet === 0
                    ? "Apostar"
                    : "Subir"}
              </button>
            </div>
            <p className="mt-2 hidden text-center text-xs text-muted md:block">F no ir · C o espacio igualar · R subir</p>
          </>
        )}
      </footer>
    </main>
  );
}

function presets(table: Table, seat: number): { label: string; to: number }[] {
  const legal = legalActions(table, seat);
  if (legal.minRaise == null || legal.maxRaise == null) return [];
  const player = table.seats[seat]!;
  const call = Math.max(0, table.currentBet - player.bet);
  const pot = potTotal(table);
  const size = (fraction: number) => {
    const inc = Math.max(table.bb, Math.round((pot + call) * fraction));
    const to = (table.currentBet === 0 ? 0 : table.currentBet) + inc;
    return Math.min(legal.maxRaise!, Math.max(legal.minRaise!, to));
  };
  const raw = [
    { label: "Mín", to: legal.minRaise },
    { label: "½", to: size(0.5) },
    { label: "Bote", to: size(1) },
    { label: "All-in", to: legal.maxRaise },
  ];
  const seen = new Set<number>();
  return raw.filter((item) => {
    if (seen.has(item.to)) return false;
    seen.add(item.to);
    return true;
  });
}
