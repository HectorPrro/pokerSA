import { useCallback, useEffect, useRef, useState } from "react";
import { chooseAction } from "./ai";
import { playAction, resumeAudio, unlockAudio } from "./audio";
import { applyAction, createTable, heroSeat, legalActions, startHand, type Act, type Table } from "./engine";
import { DEFAULT_SAVE, REGULARS, RELOAD, SAVE_KEY, stakeById, type Save, type Stake } from "./stakes";

function loadSave(): Save {
  if (typeof window === "undefined") return DEFAULT_SAVE;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return DEFAULT_SAVE;
    const parsed = JSON.parse(raw) as Save;
    if (parsed.version !== 1 || typeof parsed.bankroll !== "number") return DEFAULT_SAVE;
    return {
      ...DEFAULT_SAVE,
      ...parsed,
      stats: { ...DEFAULT_SAVE.stats, ...parsed.stats },
      name: (parsed.name || "Alex").slice(0, 16),
    };
  } catch {
    return DEFAULT_SAVE;
  }
}

function botStack(bb: number, index: number): number {
  return bb * (50 + ((index * 17) % 41));
}

function buildTable(name: string, stake: Stake, stack: number, button: number, handNo: number): Table {
  const seats = [
    { name: name.trim() || "Alex", stack, isHero: true as const, style: "human" as const },
    ...REGULARS.map((r, i) => ({
      name: r.name,
      stack: botStack(stake.bb, i),
      style: r.style,
    })),
  ];
  const table = createTable({ sb: stake.sb, bb: stake.bb, seats, button });
  table.handNo = handNo;
  return startHand(table, { advance: handNo > 0 });
}

export function useRoom() {
  const [save, setSave] = useState<Save>(DEFAULT_SAVE);
  const [hydrated, setHydrated] = useState(false);
  const [table, setTable] = useState<Table | null>(null);
  const [stakeId, setStakeId] = useState<string | null>(null);
  const [clock, setClock] = useState(20);
  const tableRef = useRef<Table | null>(null);
  const saveRef = useRef(save);
  const settled = useRef(0);
  tableRef.current = table;
  saveRef.current = save;

  const write = useCallback((next: Save) => {
    saveRef.current = next;
    setSave(next);
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota */
    }
  }, []);

  useEffect(() => {
    const stored = loadSave();
    setSave(stored);
    saveRef.current = stored;
    if (stored.session) {
      const stake = stakeById(stored.session.stakeId);
      if (stake && stored.session.stack > 0) {
        setStakeId(stake.id);
        setTable(buildTable(stored.name, stake, stored.session.stack, stored.session.button, stored.session.handNo));
      } else {
        write({ ...stored, session: null });
      }
    }
    setHydrated(true);
    const onVis = () => {
      if (document.visibilityState === "visible") resumeAudio();
    };
    window.addEventListener("pointerdown", unlockAudio);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [write]);

  useEffect(() => {
    if (!table || table.phase !== "between") return;
    if (settled.current === table.handNo) return;
    settled.current = table.handNo;
    const hero = heroSeat(table);
    const net = table.winners.find((w) => w.seat === hero.seat)?.net ?? 0;
    const current = saveRef.current;
    write({
      ...current,
      stats: {
        hands: current.stats.hands + 1,
        won: current.stats.won + (net > 0 ? 1 : 0),
        best: Math.max(current.stats.best, net),
      },
      session: current.session
        ? { ...current.session, stack: hero.stack, button: table.button, handNo: table.handNo }
        : current.session,
    });
    if (current.sound && net > 0) playAction("win");
  }, [table, write]);

  useEffect(() => {
    if (!table || table.phase !== "betting" || table.toAct == null) return;
    const actor = table.seats[table.toAct];
    if (!actor || actor.isHero) return;
    const wait = 720 + Math.floor(Math.random() * 900);
    const id = window.setTimeout(() => {
      const live = tableRef.current;
      if (!live || live.phase !== "betting" || live.toAct !== actor.seat) return;
      let action: Act;
      try {
        action = chooseAction(live, actor.seat);
      } catch {
        const legal = legalActions(live, actor.seat);
        action = legal.check ? { kind: "check" } : legal.fold ? { kind: "fold" } : { kind: "call" };
      }
      try {
        const next = applyAction(live, actor.seat, action);
        if (saveRef.current.sound) playAction(action.kind === "raise" ? "raise" : action.kind);
        setTable(next);
      } catch {
        const legal = legalActions(live, actor.seat);
        const backup: Act = legal.check ? { kind: "check" } : legal.fold ? { kind: "fold" } : { kind: "call" };
        try {
          setTable(applyAction(live, actor.seat, backup));
        } catch {
          /* the seat cannot act */
        }
      }
    }, wait);
    return () => window.clearTimeout(id);
  }, [table]);

  useEffect(() => {
    if (!table || table.phase !== "betting" || table.toAct == null) return;
    const actor = table.seats[table.toAct];
    if (!actor?.isHero) return;
    let left = 20;
    setClock(20);
    const id = window.setInterval(() => {
      left -= 1;
      setClock(left);
      if (left > 0) return;
      window.clearInterval(id);
      const live = tableRef.current;
      if (!live || live.phase !== "betting" || live.toAct !== actor.seat) return;
      const legal = legalActions(live, actor.seat);
      const action: Act = legal.check ? { kind: "check" } : { kind: "fold" };
      try {
        if (saveRef.current.sound) playAction(action.kind);
        setTable(applyAction(live, actor.seat, action));
      } catch {
        /* ignore */
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [table]);

  const sit = useCallback(
    (stake: Stake, buyIn: number) => {
      unlockAudio();
      const current = saveRef.current;
      const amount = Math.round(buyIn);
      if (amount < stake.min || amount > Math.min(stake.max, current.bankroll)) return;
      const nextTable = buildTable(current.name, stake, amount, 5, 0);
      const hero = heroSeat(nextTable);
      write({
        ...current,
        bankroll: current.bankroll - amount,
        session: { stakeId: stake.id, stack: hero.stack + hero.totalPut, button: nextTable.button, handNo: 0 },
      });
      settled.current = 0;
      setStakeId(stake.id);
      setTable(nextTable);
      if (current.sound) playAction("deal");
    },
    [write],
  );

  const leave = useCallback(() => {
    const live = tableRef.current;
    const current = saveRef.current;
    let back = 0;
    if (live) {
      const hero = heroSeat(live);
      back = live.phase === "betting" ? hero.stack + hero.totalPut : hero.stack;
    }
    write({ ...current, bankroll: current.bankroll + back, session: null });
    setTable(null);
    setStakeId(null);
  }, [write]);

  const act = useCallback((action: Act) => {
    const live = tableRef.current;
    if (!live || live.phase !== "betting" || live.toAct == null) return;
    const actor = live.seats[live.toAct];
    if (!actor?.isHero) return;
    try {
      const next = applyAction(live, actor.seat, action);
      if (saveRef.current.sound) playAction(action.kind === "raise" ? "raise" : action.kind);
      setTable(next);
    } catch {
      /* illegal clicks are ignored */
    }
  }, []);

  const nextHand = useCallback(() => {
    const live = tableRef.current;
    const current = saveRef.current;
    if (!live || (live.phase !== "between" && live.phase !== "bust")) return;
    const hero = heroSeat(live);
    if (hero.stack <= 0) {
      setTable({ ...live, phase: "bust", toAct: null, banner: "Te quedaste sin fichas" });
      if (current.session) write({ ...current, session: { ...current.session, stack: 0 } });
      return;
    }
    const next = startHand(live, { advance: true });
    setTable(next);
    if (current.sound) playAction("deal");
  }, [write]);

  useEffect(() => {
    if (!table || table.phase !== "between") return;
    const id = window.setTimeout(() => nextHand(), 4800);
    return () => window.clearTimeout(id);
  }, [table, nextHand]);

  const rebuy = useCallback(
    (amount: number) => {
      const live = tableRef.current;
      const current = saveRef.current;
      const stake = stakeId ? stakeById(stakeId) : undefined;
      if (!live || !stake) return;
      const chipsIn = Math.round(amount);
      if (chipsIn < stake.min || chipsIn > Math.min(stake.max, current.bankroll)) return;
      const clone = structuredClone(live);
      const hero = heroSeat(clone);
      hero.stack = chipsIn;
      hero.sittingOut = false;
      hero.inHand = false;
      const next = startHand(clone, { advance: true });
      write({
        ...current,
        bankroll: current.bankroll - chipsIn,
        session: {
          stakeId: stake.id,
          stack: chipsIn,
          button: next.button,
          handNo: Math.max(0, next.handNo - 1),
        },
      });
      settled.current = next.phase === "between" ? next.handNo : settled.current;
      setTable(next);
    },
    [stakeId, write],
  );

  const reload = useCallback(() => {
    const current = saveRef.current;
    if (current.bankroll >= 500) return;
    write({ ...current, bankroll: current.bankroll + RELOAD });
  }, [write]);

  const setName = useCallback(
    (name: string) => {
      write({ ...saveRef.current, name: name.slice(0, 16) });
    },
    [write],
  );

  const toggleSound = useCallback(() => {
    unlockAudio();
    write({ ...saveRef.current, sound: !saveRef.current.sound });
  }, [write]);

  return {
    hydrated,
    save,
    table,
    stake: stakeId ? (stakeById(stakeId) ?? null) : null,
    clock,
    sit,
    leave,
    act,
    nextHand,
    rebuy,
    reload,
    setName,
    toggleSound,
  };
}
