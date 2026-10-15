import { useState } from "react";
import { chips } from "@/poker/cards";
import { STAKES, type Stake } from "@/poker/stakes";
import type { Save } from "@/poker/stakes";

export function Lobby({
  save,
  onName,
  onSit,
  onReload,
  onToggleSound,
}: {
  save: Save;
  onName: (name: string) => void;
  onSit: (stake: Stake, buyIn: number) => void;
  onReload: () => void;
  onToggleSound: () => void;
}) {
  const [picked, setPicked] = useState<string>("media");
  const stake = STAKES.find((s) => s.id === picked) ?? STAKES[1]!;
  const cap = Math.min(stake.max, save.bankroll);
  const open = save.bankroll >= stake.min;
  const [buyIn, setBuyIn] = useState(() => Math.min(STAKES[1]!.max, Math.max(STAKES[1]!.min, STAKES[1]!.bb * 100)));

  const amount = Math.min(cap, Math.max(stake.min, buyIn));

  return (
    <main className="room mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-6">
      <header className="flex items-center justify-between gap-3">
        <p className="font-display text-2xl tracking-wide text-gold">RÍO</p>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-ghost min-h-11 px-3" onClick={onToggleSound}>
            {save.sound ? "Sonido" : "Silencio"}
          </button>
          <p className="rounded-full border border-line bg-wood px-3 py-2 text-sm tabular-nums">
            Banco {chips(save.bankroll)}
          </p>
        </div>
      </header>

      <section className="mt-8 grid items-start gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <h1 className="font-display text-5xl leading-none text-cream md:text-7xl">RÍO</h1>
          <p className="mt-3 text-lg text-gold">No-Limit Hold'em</p>
          <p className="mt-4 max-w-md text-muted">
            Seis asientos, ciegas vivas y un mazo que no se ve. Los regulares no te regalan nada. Fichas de juego:
            aquí no se apuesta dinero.
          </p>
          <label className="mt-6 block text-sm text-muted" htmlFor="nombre">
            Tu nombre en la mesa
          </label>
          <input
            id="nombre"
            value={save.name}
            maxLength={16}
            onChange={(event) => onName(event.target.value)}
            className="mt-2 w-full max-w-xs rounded-lg border border-line bg-wood px-3 py-3 text-cream"
          />
          <dl className="mt-6 grid max-w-sm grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-muted">Manos</dt>
              <dd className="font-display text-2xl tabular-nums">{save.stats.hands}</dd>
            </div>
            <div>
              <dt className="text-muted">Ganadas</dt>
              <dd className="font-display text-2xl tabular-nums">{save.stats.won}</dd>
            </div>
            <div>
              <dt className="text-muted">Mejor</dt>
              <dd className="font-display text-2xl tabular-nums">{chips(save.stats.best)}</dd>
            </div>
          </dl>
          {save.bankroll < 500 && (
            <button type="button" className="btn btn-gold mt-6" onClick={onReload}>
              Recarga de cortesía · {chips(5000)}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {STAKES.map((item) => {
            const locked = save.bankroll < item.min;
            const active = item.id === stake.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={locked}
                onClick={() => {
                  setPicked(item.id);
                  const nextCap = Math.min(item.max, save.bankroll);
                  setBuyIn(Math.min(nextCap, Math.max(item.min, item.bb * 100)));
                }}
                className={`rounded-2xl border px-4 py-4 text-left ${active ? "border-gold bg-wood" : "border-line bg-wood/60"}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-2xl">{item.name}</h2>
                  <p className="tabular-nums text-gold">
                    {chips(item.sb)}/{chips(item.bb)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted">{item.note}</p>
                <p className="mt-2 text-sm tabular-nums">
                  Entrada {chips(item.min)}–{chips(item.max)}
                  {locked ? " · te falta banco" : ""}
                </p>
              </button>
            );
          })}

          {open && (
            <div className="rounded-2xl border border-line bg-rail p-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-muted">Fichas para sentarte</p>
                <p className="font-display text-3xl tabular-nums">{chips(amount)}</p>
              </div>
              <input
                className="mt-3 w-full accent-gold"
                type="range"
                min={stake.min}
                max={cap}
                step={stake.bb}
                value={amount}
                aria-label="Entrada"
                onChange={(event) => setBuyIn(Number(event.target.value))}
              />
              <button type="button" className="btn btn-gold mt-4 w-full" onClick={() => onSit(stake, amount)}>
                Sentarme en {stake.name}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
