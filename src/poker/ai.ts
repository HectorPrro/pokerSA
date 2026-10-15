import type { Card } from "./cards.ts";
import { draws, evaluate } from "./eval.ts";
import {
  legalActions,
  potTotal,
  type Act,
  type Rng,
  type Seat,
  type Style,
  type Table,
} from "./engine.ts";

interface Profile {
  open: number;
  call: number;
  threeBet: number;
  bluff: number;
  value: number;
  looseness: number;
  slowplay: number;
}

const PROFILES: Record<Exclude<Style, "human">, Profile> = {
  nit: { open: 12, call: 10, threeBet: 16, bluff: 0.04, value: 0.72, looseness: -0.06, slowplay: 0.35 },
  tag: { open: 9, call: 7, threeBet: 14, bluff: 0.12, value: 0.62, looseness: 0, slowplay: 0.18 },
  lag: { open: 6, call: 4.5, threeBet: 10, bluff: 0.28, value: 0.52, looseness: 0.06, slowplay: 0.08 },
  station: { open: 10, call: 3.5, threeBet: 17, bluff: 0.04, value: 0.78, looseness: 0.14, slowplay: 0.45 },
  maniac: { open: 3, call: 1, threeBet: 6, bluff: 0.4, value: 0.4, looseness: 0.1, slowplay: 0.02 },
};

function chen(a: Card, b: Card): number {
  const hi = Math.max(a.r, b.r);
  const lo = Math.min(a.r, b.r);
  const base = (r: number) => (r === 14 ? 10 : r === 13 ? 8 : r === 12 ? 7 : r === 11 ? 6 : r / 2);
  let score = base(hi);
  if (a.r === b.r) score = Math.max(score * 2, 5);
  if (a.s === b.s) score += 2;
  if (a.r !== b.r) {
    const gap = hi - lo - 1;
    if (gap === 1) score -= 1;
    else if (gap === 2) score -= 2;
    else if (gap === 3) score -= 4;
    else if (gap >= 4) score -= 5;
    if (gap <= 1 && hi < 12) score += 1;
  }
  return score;
}

function posTax(t: Table, seat: number): number {
  const d = (seat - t.button + 6) % 6;
  if (d === 0 || d === 5) return -2;
  if (d === 4) return -1;
  if (d === 3) return 2;
  if (d === 1) return 0;
  return 1;
}

function suitedConnector(a: Card, b: Card): boolean {
  if (a.s !== b.s || a.r === b.r) return false;
  return Math.abs(a.r - b.r) === 1;
}

export function handEquity(hole: [Card, Card], board: Card[]): number {
  if (board.length < 3) return Math.max(0.08, Math.min(0.88, chen(hole[0], hole[1]) / 22));
  const cards = [...hole, ...board];
  const value = evaluate(cards);
  let eq = [0.2, 0.46, 0.62, 0.7, 0.78, 0.84, 0.92, 0.97, 0.99][value.cat] ?? 0.2;
  if (value.cat === 1) {
    const boardRanks = board.map((c) => c.r).sort((a, b) => b - a);
    const top = boardRanks[0] ?? 0;
    if (hole[0].r === hole[1].r && hole[0].r > top) eq = 0.74;
    else if (hole[0].r === top || hole[1].r === top) eq = 0.58;
    else if (boardRanks[1] && (hole[0].r === boardRanks[1] || hole[1].r === boardRanks[1])) eq = 0.4;
    else eq = 0.3;
  }
  const suited = new Map<string, number>();
  for (const c of board) suited.set(c.s, (suited.get(c.s) ?? 0) + 1);
  const boardFlush = [...suited.values()].some((n) => n >= 3);
  const weFlush = value.cat === 5 || value.cat === 8;
  if (boardFlush && !weFlush && value.cat < 6) eq *= 0.78;
  if (board.length < 5 && value.cat < 4) {
    const d = draws(cards);
    if (d.includes("color")) eq += board.length === 3 ? 0.16 : 0.09;
    if (d.includes("abierta")) eq += board.length === 3 ? 0.13 : 0.08;
    else if (d.includes("interna")) eq += board.length === 3 ? 0.06 : 0.04;
  }
  return Math.max(0.04, Math.min(0.98, eq));
}

function raiseTo(t: Table, seat: number, target: number): number {
  const legal = legalActions(t, seat);
  if (legal.minRaise == null || legal.maxRaise == null) return target;
  return Math.min(legal.maxRaise, Math.max(legal.minRaise, Math.round(target)));
}

function potRaise(t: Table, seat: number, fraction: number): number {
  const p = t.seats[seat]!;
  const toCall = Math.max(0, t.currentBet - p.bet);
  const inc = Math.max(t.bb, Math.round((potTotal(t) + toCall) * fraction));
  const to = (t.currentBet === 0 ? 0 : t.currentBet) + inc;
  return raiseTo(t, seat, to);
}

function fallback(t: Table, seat: number): Act {
  const legal = legalActions(t, seat);
  if (legal.check) return { kind: "check" };
  if (legal.call > 0 && legal.call <= t.bb) return { kind: "call" };
  if (legal.fold) return { kind: "fold" };
  if (legal.call > 0) return { kind: "call" };
  return { kind: "check" };
}

export function chooseAction(t: Table, seat: number, rng: Rng = Math.random): Act {
  const p = t.seats[seat] as Seat | undefined;
  const legal = legalActions(t, seat);
  if (!p?.hole || p.style === "human") return fallback(t, seat);
  const style = PROFILES[p.style];
  const hole = p.hole;
  const tax = posTax(t, seat);

  if (t.street === "preflop") {
    const score = chen(hole[0], hole[1]);
    const toCall = Math.max(0, t.currentBet - p.bet);
    if (toCall === 0) {
      if (legal.minRaise != null && score >= style.threeBet && rng() > 0.55) {
        return { kind: "raise", to: raiseTo(t, seat, Math.max(t.bb * 3, t.currentBet * 3)) };
      }
      if (legal.check) return { kind: "check" };
    }
    if (t.raises === 0 && t.currentBet <= t.bb) {
      if (legal.minRaise != null && score >= style.open + tax) {
        return { kind: "raise", to: raiseTo(t, seat, t.bb * 3) };
      }
      if (legal.call > 0 && score >= style.open + tax - 3) return { kind: "call" };
      if (legal.fold) return { kind: "fold" };
      if (legal.check) return { kind: "check" };
      if (legal.call > 0) return { kind: "call" };
    }
    const pressure = t.raises >= 2 ? 3 : t.raises === 1 ? 1 : 0;
    if (legal.minRaise != null && score >= style.threeBet + pressure + Math.max(0, tax) && rng() > 0.28) {
      return { kind: "raise", to: raiseTo(t, seat, t.currentBet * 3) };
    }
    if (score >= style.call + pressure + Math.max(0, tax)) {
      if (legal.call > 0) return { kind: "call" };
      if (legal.check) return { kind: "check" };
    }
    if (suitedConnector(hole[0], hole[1]) && tax < 0 && toCall <= t.bb * 4 && legal.call > 0 && rng() < 0.7) {
      return { kind: "call" };
    }
    if (legal.fold) return { kind: "fold" };
    if (legal.check) return { kind: "check" };
    if (legal.call > 0) return { kind: "call" };
    return fallback(t, seat);
  }

  const eq = handEquity(hole, t.board) + style.looseness + (rng() - 0.5) * 0.08;
  const toCall = legal.call;
  const pot = potTotal(t);
  const price = toCall > 0 ? toCall / (pot + toCall) : 0;

  if (toCall > 0) {
    const valueRaise = eq >= style.value && legal.minRaise != null && rng() > style.slowplay && t.raises < 3;
    const bluff = eq < 0.3 && legal.minRaise != null && rng() < style.bluff && t.raises < 2;
    if (valueRaise || bluff) return { kind: "raise", to: potRaise(t, seat, eq > 0.85 ? 1 : 0.66) };
    if (eq + 0.02 >= price || toCall <= t.bb) {
      if (legal.call > 0) return { kind: "call" };
    }
    if (legal.fold) return { kind: "fold" };
    if (legal.call > 0) return { kind: "call" };
    if (legal.check) return { kind: "check" };
    return fallback(t, seat);
  }

  if (legal.minRaise != null && eq >= style.value && rng() > 0.22) {
    return { kind: "raise", to: potRaise(t, seat, 0.66) };
  }
  if (legal.minRaise != null && eq < 0.24 && rng() < style.bluff * 0.8) {
    return { kind: "raise", to: potRaise(t, seat, 0.66) };
  }
  if (legal.check) return { kind: "check" };
  return fallback(t, seat);
}
