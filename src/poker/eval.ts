import { rankMany, rankOne, type Card, type Suit } from "./cards.ts";

export interface HandValue {
  score: number;
  cat: number;
  name: string;
}

const CAT = 15 ** 5;

function pack(ranks: number[]): number {
  return ranks.reduce((acc, r) => acc * 15 + r, 0);
}

function straightHigh(ranks: number[]): number {
  const uniq = [...new Set(ranks)].sort((a, b) => a - b);
  if (uniq.length !== 5) return 0;
  if (uniq[4]! - uniq[0]! === 4) return uniq[4]!;
  if (uniq.join(",") === "2,3,4,5,14") return 5;
  return 0;
}

export function evaluate5(cards: Card[]): HandValue {
  const ranksDesc = cards.map((c) => c.r).sort((a, b) => b - a);
  const flush = cards.every((c) => c.s === cards[0]!.s);
  const counts = new Map<number, number>();
  for (const r of ranksDesc) counts.set(r, (counts.get(r) ?? 0) + 1);
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const high = straightHigh(ranksDesc);
  const suit = cards[0]!.s;

  if (flush && high) {
    const royal = high === 14;
    return {
      cat: 8,
      score: 8 * CAT + high,
      name: royal ? "Escalera real" : `Escalera de color al ${rankOne(high)}`,
    };
  }
  if (groups[0]![1] === 4) {
    const quad = groups[0]![0];
    const kicker = groups[1]![0];
    return {
      cat: 7,
      score: 7 * CAT + quad * 15 + kicker,
      name: `Póker de ${rankMany(quad)}`,
    };
  }
  if (groups[0]![1] === 3 && groups[1]![1] === 2) {
    return {
      cat: 6,
      score: 6 * CAT + groups[0]![0] * 15 + groups[1]![0],
      name: `Full de ${rankMany(groups[0]![0])} y ${rankMany(groups[1]![0])}`,
    };
  }
  if (flush) {
    return {
      cat: 5,
      score: 5 * CAT + pack(ranksDesc),
      name: `Color de ${suitName(suit)}, ${rankOne(ranksDesc[0]!)}`,
    };
  }
  if (high) {
    return {
      cat: 4,
      score: 4 * CAT + high,
      name: `Escalera al ${rankOne(high)}`,
    };
  }
  if (groups[0]![1] === 3) {
    const kickers = groups.slice(1).map((g) => g[0]);
    return {
      cat: 3,
      score: 3 * CAT + groups[0]![0] * 15 ** 2 + pack(kickers),
      name: `Trío de ${rankMany(groups[0]![0])}`,
    };
  }
  if (groups[0]![1] === 2 && groups[1]![1] === 2) {
    const hi = Math.max(groups[0]![0], groups[1]![0]);
    const lo = Math.min(groups[0]![0], groups[1]![0]);
    const kicker = groups[2]![0];
    return {
      cat: 2,
      score: 2 * CAT + hi * 15 ** 2 + lo * 15 + kicker,
      name: `Doble pareja, ${rankMany(hi)} y ${rankMany(lo)}`,
    };
  }
  if (groups[0]![1] === 2) {
    const kickers = groups.slice(1).map((g) => g[0]);
    return {
      cat: 1,
      score: 1 * CAT + groups[0]![0] * 15 ** 3 + pack(kickers),
      name: `Pareja de ${rankMany(groups[0]![0])}`,
    };
  }
  return {
    cat: 0,
    score: pack(ranksDesc),
    name: `Carta alta, ${rankOne(ranksDesc[0]!)}`,
  };
}

function suitName(s: Suit): string {
  return { s: "picas", h: "corazones", d: "diamantes", c: "tréboles" }[s];
}

function combinations(cards: Card[], k: number): Card[][] {
  const out: Card[][] = [];
  const cur: Card[] = [];
  const walk = (start: number) => {
    if (cur.length === k) {
      out.push(cur.slice());
      return;
    }
    for (let i = start; i < cards.length; i++) {
      cur.push(cards[i]!);
      walk(i + 1);
      cur.pop();
    }
  };
  walk(0);
  return out;
}

export function evaluate(cards: Card[]): HandValue {
  if (cards.length < 5) {
    return { cat: 0, score: 0, name: "Mano incompleta" };
  }
  if (cards.length === 5) return evaluate5(cards);
  let best: HandValue | null = null;
  for (const combo of combinations(cards, 5)) {
    const value = evaluate5(combo);
    if (!best || value.score > best.score) best = value;
  }
  return best!;
}

export type Draw = "color" | "abierta" | "interna";

export function draws(cards: Card[]): Draw[] {
  if (cards.length < 3 || cards.length >= 7) return [];
  const found: Draw[] = [];
  const suitCounts = new Map<Suit, number>();
  for (const c of cards) suitCounts.set(c.s, (suitCounts.get(c.s) ?? 0) + 1);
  const flushMade = [...suitCounts.values()].some((n) => n >= 5);
  if (!flushMade && [...suitCounts.values()].some((n) => n === 4)) found.push("color");

  const made = cards.length >= 5 ? evaluate(cards).cat >= 4 : false;
  if (!made) {
    const set = new Set<number>(cards.map((c) => c.r));
    if (set.has(14)) set.add(1);
    let open = false;
    let gut = false;
    for (let low = 1; low <= 10; low++) {
      let have = 0;
      let miss = 0;
      for (let k = 0; k < 5; k++) {
        if (set.has(low + k)) have++;
        else miss = low + k;
      }
      if (have === 4) {
        if (miss === low || miss === low + 4) open = true;
        else gut = true;
      }
    }
    if (open) found.push("abierta");
    else if (gut) found.push("interna");
  }
  return found;
}

export function describeHolding(hole: [Card, Card], board: Card[]): string {
  if (board.length < 3) {
    return "";
  }
  const value = evaluate([...hole, ...board]);
  const d = draws([...hole, ...board]);
  if (value.cat === 0 && d.length) {
    if (d.includes("color") && d.includes("abierta")) return "Proyecto de color y escalera";
    if (d.includes("color")) return "Proyecto de color";
    if (d.includes("abierta")) return "Proyecto de escalera abierta";
    return "Proyecto de escalera interna";
  }
  if (value.cat > 0 && value.cat < 4 && d.includes("color") && board.length < 5) {
    return `${value.name} · proyecto de color`;
  }
  return value.name;
}
