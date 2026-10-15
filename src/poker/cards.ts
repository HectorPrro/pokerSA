export type Suit = "s" | "h" | "d" | "c";
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface Card {
  r: Rank;
  s: Suit;
}

export const SUITS: Suit[] = ["s", "h", "d", "c"];
export const RANKS: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const SUIT_CHAR: Record<Suit, string> = { s: "♠", h: "♥", d: "♦", c: "♣" };

const RANK_CHAR: Record<number, string> = {
  11: "J",
  12: "Q",
  13: "K",
  14: "A",
};

const RANK_ONE: Record<number, string> = {
  14: "as",
  13: "rey",
  12: "reina",
  11: "jota",
  10: "diez",
  9: "nueve",
  8: "ocho",
  7: "siete",
  6: "seis",
  5: "cinco",
  4: "cuatro",
  3: "tres",
  2: "dos",
};

const RANK_MANY: Record<number, string> = {
  14: "ases",
  13: "reyes",
  12: "reinas",
  11: "jotas",
  10: "dieces",
  9: "nueves",
  8: "ochos",
  7: "sietes",
  6: "seises",
  5: "cincos",
  4: "cuatros",
  3: "treses",
  2: "doses",
};

export function rankChar(r: Rank): string {
  return RANK_CHAR[r] ?? String(r);
}

export function rankOne(r: number): string {
  return RANK_ONE[r] ?? String(r);
}

export function rankMany(r: number): string {
  return RANK_MANY[r] ?? String(r);
}

export function cardKey(c: Card): string {
  return `${rankChar(c.r)}${c.s}`;
}

export function cardText(c: Card): string {
  return `${rankChar(c.r)}${SUIT_CHAR[c.s]}`;
}

export function suitLabel(s: Suit): string {
  return { s: "picas", h: "corazones", d: "diamantes", c: "tréboles" }[s];
}

export function cardLabel(c: Card): string {
  return `${rankOne(c.r)} de ${suitLabel(c.s)}`;
}

export function isRed(s: Suit): boolean {
  return s === "h" || s === "d";
}

export function makeDeck(): Card[] {
  const deck: Card[] = [];
  for (const s of SUITS) {
    for (const r of RANKS) deck.push({ r, s });
  }
  return deck;
}

export function shuffle(deck: Card[], rng: () => number = Math.random): Card[] {
  const a = deck.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

export function chips(n: number): string {
  return new Intl.NumberFormat("es-ES").format(Math.max(0, Math.round(n)));
}

export function preflopLabel(a: Card, b: Card): string {
  const hi = a.r >= b.r ? a : b;
  const lo = a.r >= b.r ? b : a;
  if (hi.r === lo.r) return `Pareja de ${rankMany(hi.r)}`;
  const suited = hi.s === lo.s;
  return `${cap(rankOne(hi.r))}-${rankOne(lo.r)} ${suited ? "suited" : "offsuit"}`;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
