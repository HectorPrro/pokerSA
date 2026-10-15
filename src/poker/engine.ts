import { cardText, makeDeck, shuffle, type Card } from "./cards.ts";
import { evaluate, type HandValue } from "./eval.ts";

export type Style = "nit" | "tag" | "lag" | "station" | "maniac" | "human";
export type Street = "preflop" | "flop" | "turn" | "river";
export type Phase = "betting" | "between" | "bust";

export interface Seat {
  seat: number;
  name: string;
  isHero: boolean;
  style: Style;
  stack: number;
  hole: [Card, Card] | null;
  bet: number;
  totalPut: number;
  folded: boolean;
  allIn: boolean;
  acted: boolean;
  closed: boolean;
  sittingOut: boolean;
  inHand: boolean;
  lastAct: string;
}

export interface Winner {
  seat: number;
  amount: number;
  net: number;
  hand?: string;
}

export interface Table {
  sb: number;
  bb: number;
  seats: Seat[];
  button: number;
  sbSeat: number | null;
  bbSeat: number | null;
  deck: Card[];
  di: number;
  board: Card[];
  street: Street;
  pot: number;
  currentBet: number;
  lastRaiseSize: number;
  raises: number;
  toAct: number | null;
  phase: Phase;
  handNo: number;
  showCards: boolean;
  winners: Winner[];
  log: string[];
  banner: string;
}

export type Act = { kind: "fold" } | { kind: "check" } | { kind: "call" } | { kind: "raise"; to: number };

export interface Legal {
  fold: boolean;
  check: boolean;
  call: number;
  minRaise: number | null;
  maxRaise: number | null;
}

export interface SeatSpec {
  name: string;
  stack: number;
  isHero?: boolean;
  style?: Style;
  sittingOut?: boolean;
}

export type Rng = () => number;

const STREETS: Street[] = ["preflop", "flop", "turn", "river"];

export function potTotal(t: Table): number {
  return t.seats.reduce((sum, s) => sum + s.totalPut, 0);
}

export function displayPot(t: Table): number {
  if (t.phase === "between" || t.phase === "bust") return t.pot;
  return potTotal(t);
}

export function chipSum(t: Table): number {
  return t.seats.reduce((sum, s) => sum + s.stack + s.totalPut, 0);
}

export function createTable(opts: {
  sb: number;
  bb: number;
  seats: SeatSpec[];
  button?: number;
}): Table {
  if (opts.seats.length !== 6) throw new Error("La mesa es de 6 asientos");
  return {
    sb: opts.sb,
    bb: opts.bb,
    button: opts.button ?? 5,
    sbSeat: null,
    bbSeat: null,
    seats: opts.seats.map((s, seat) => ({
      seat,
      name: s.name,
      isHero: Boolean(s.isHero),
      style: s.style ?? (s.isHero ? "human" : "tag"),
      stack: s.stack,
      hole: null,
      bet: 0,
      totalPut: 0,
      folded: false,
      allIn: false,
      acted: false,
      closed: false,
      sittingOut: Boolean(s.sittingOut),
      inHand: false,
      lastAct: "",
    })),
    deck: [],
    di: 0,
    board: [],
    street: "preflop",
    pot: 0,
    currentBet: 0,
    lastRaiseSize: opts.bb,
    raises: 0,
    toAct: null,
    phase: "betting",
    handNo: 0,
    showCards: false,
    winners: [],
    log: [],
    banner: "",
  };
}

function say(t: Table, line: string) {
  t.log = [...t.log, line].slice(-30);
}

function nextSeat(from: number, pred: (s: Seat) => boolean, seats: Seat[]): number | null {
  for (let i = 1; i <= 6; i++) {
    const idx = (from + i) % 6;
    if (pred(seats[idx]!)) return idx;
  }
  return null;
}

function live(t: Table): Seat[] {
  return t.seats.filter((s) => s.inHand && !s.folded);
}

function bettingDone(t: Table): boolean {
  const inHand = live(t);
  if (inHand.length <= 1) return true;
  return inHand.every((s) => s.allIn || (s.acted && s.bet === t.currentBet));
}

function nextActor(t: Table, from: number): number | null {
  if (bettingDone(t)) return null;
  return nextSeat(
    from,
    (s) => s.inHand && !s.folded && !s.allIn && !(s.acted && s.bet === t.currentBet),
    t.seats,
  );
}

function draw(t: Table, n: number): Card[] {
  const cards = t.deck.slice(t.di, t.di + n);
  if (cards.length < n) throw new Error("Mazo agotado");
  t.di += n;
  return cards;
}

function post(t: Table, seat: number, amount: number, label: string) {
  const p = t.seats[seat]!;
  const pay = Math.min(p.stack, amount);
  p.stack -= pay;
  p.bet += pay;
  p.totalPut += pay;
  if (p.stack === 0) p.allIn = true;
  p.lastAct = label;
  say(t, `${p.name} pone la ${label} (${pay})`);
}

export interface StartOpts {
  advance?: boolean;
  rebuy?: boolean;
  rng?: Rng;
  deck?: Card[];
}

export function startHand(src: Table, opts: StartOpts = {}): Table {
  const t = structuredClone(src);
  const rng = opts.rng ?? Math.random;
  const hero = t.seats.find((s) => s.isHero);

  for (const s of t.seats) {
    if (!s.isHero && !s.sittingOut && s.stack < t.bb && opts.rebuy !== false) {
      const bbCount = 40 + Math.floor(rng() * 61);
      s.stack = t.bb * bbCount;
      say(t, `${s.name} vuelve a entrar con ${s.stack}`);
    }
  }

  const playing = t.seats.filter((s) => !s.sittingOut && s.stack > 0);
  if (!hero || hero.stack <= 0 || playing.length < 2) {
    t.phase = "bust";
    t.toAct = null;
    t.banner = hero && hero.stack <= 0 ? "Te quedaste sin fichas" : "No hay suficientes jugadores";
    return t;
  }

  if (opts.advance !== false && t.handNo > 0) {
    const nxt = nextSeat(t.button, (s) => !s.sittingOut && s.stack > 0, t.seats);
    if (nxt != null) t.button = nxt;
  }

  t.handNo += 1;
  t.board = [];
  t.street = "preflop";
  t.pot = 0;
  t.currentBet = 0;
  t.lastRaiseSize = t.bb;
  t.raises = 0;
  t.showCards = false;
  t.winners = [];
  t.banner = "";
  t.phase = "betting";
  t.deck = opts.deck ? opts.deck.slice() : shuffle(makeDeck(), rng);
  t.di = 0;

  for (const s of t.seats) {
    s.hole = null;
    s.bet = 0;
    s.totalPut = 0;
    s.folded = false;
    s.allIn = false;
    s.acted = false;
    s.closed = false;
    s.lastAct = "";
    s.inHand = !s.sittingOut && s.stack > 0;
  }

  const sbSeat = nextSeat(t.button, (s) => s.inHand, t.seats);
  const bbSeat = sbSeat == null ? null : nextSeat(sbSeat, (s) => s.inHand, t.seats);
  if (sbSeat == null || bbSeat == null) {
    t.phase = "bust";
    t.banner = "No hay suficientes jugadores";
    return t;
  }
  t.sbSeat = sbSeat;
  t.bbSeat = bbSeat;
  post(t, sbSeat, t.sb, "ciega chica");
  post(t, bbSeat, t.bb, "ciega grande");
  t.currentBet = Math.max(t.seats[sbSeat]!.bet, t.seats[bbSeat]!.bet);
  t.pot = 0;

  const order: number[] = [];
  for (let round = 0; round < 2; round++) {
    for (let i = 0; i < 6; i++) {
      const idx = (sbSeat + i) % 6;
      if (t.seats[idx]!.inHand) order.push(idx);
    }
  }
  const holes = new Map<number, Card[]>();
  for (const idx of order) {
    const card = draw(t, 1)[0]!;
    const bag = holes.get(idx) ?? [];
    bag.push(card);
    holes.set(idx, bag);
  }
  for (const [idx, cards] of holes) {
    t.seats[idx]!.hole = [cards[0]!, cards[1]!];
  }

  say(t, `Mano ${t.handNo}. Botón en ${t.seats[t.button]!.name}.`);
  t.toAct = nextActor(t, bbSeat);
  if (t.toAct == null) return finishStreet(t);
  return t;
}

export function legalActions(t: Table, seat: number): Legal {
  const none: Legal = { fold: false, check: false, call: 0, minRaise: null, maxRaise: null };
  const p = t.seats[seat];
  if (!p || t.phase !== "betting" || t.toAct !== seat || !p.inHand || p.folded || p.allIn) return none;
  const toCall = Math.max(0, t.currentBet - p.bet);
  const max = p.bet + p.stack;
  const check = toCall === 0;
  const call = toCall > 0 ? Math.min(toCall, p.stack) : 0;
  let minRaise: number | null = null;
  let maxRaise: number | null = null;
  if (p.stack > toCall && !p.closed) {
    maxRaise = max;
    if (t.currentBet === 0) minRaise = Math.min(t.bb, max);
    else {
      const fullTo = t.currentBet + t.lastRaiseSize;
      minRaise = max >= fullTo ? fullTo : max;
    }
  }
  return { fold: toCall > 0, check, call, minRaise, maxRaise };
}

function payTo(p: Seat, to: number) {
  const add = to - p.bet;
  if (add < 0 || add > p.stack) throw new Error("Apuesta imposible");
  p.stack -= add;
  p.bet = to;
  p.totalPut += add;
  if (p.stack === 0) p.allIn = true;
}

export function applyAction(src: Table, seat: number, act: Act): Table {
  const t = structuredClone(src);
  const legal = legalActions(t, seat);
  const p = t.seats[seat];
  if (!p) throw new Error("Asiento vacío");

  if (act.kind === "fold") {
    if (!legal.fold) throw new Error("No puede retirarse");
    p.folded = true;
    p.acted = true;
    p.lastAct = "No va";
    say(t, `${p.name} no va`);
  } else if (act.kind === "check") {
    if (!legal.check) throw new Error("No puede pasar");
    p.acted = true;
    p.lastAct = "Pasa";
    say(t, `${p.name} pasa`);
  } else if (act.kind === "call") {
    if (legal.call <= 0) throw new Error("No hay nada que igualar");
    const to = p.bet + legal.call;
    payTo(p, to);
    p.acted = true;
    p.lastAct = p.allIn ? "All-in" : "Iguala";
    say(t, p.allIn ? `${p.name} iguala all-in (${to})` : `${p.name} iguala ${legal.call}`);
  } else {
    if (legal.minRaise == null || legal.maxRaise == null) throw new Error("No puede subir");
    const to = Math.round(act.to);
    if (to < legal.minRaise || to > legal.maxRaise) throw new Error("Tamaño de subida inválido");
    const opening = t.currentBet === 0;
    const increment = to - t.currentBet;
    const full = opening ? to >= t.bb || to === legal.maxRaise : increment >= t.lastRaiseSize;
    payTo(p, to);
    p.acted = true;
    if (full) {
      t.lastRaiseSize = opening ? to : increment;
      t.currentBet = to;
      t.raises += 1;
      for (const o of t.seats) {
        if (o.seat !== seat && o.inHand && !o.folded && !o.allIn) {
          o.acted = false;
          o.closed = false;
        }
      }
    } else {
      for (const o of t.seats) {
        if (o.seat !== seat && o.acted) o.closed = true;
      }
      t.currentBet = to;
    }
    p.lastAct = p.allIn ? "All-in" : opening ? "Apuesta" : "Sube";
    say(t, opening ? `${p.name} apuesta ${to}` : `${p.name} sube a ${to}`);
  }

  const left = live(t);
  if (left.length <= 1) return award(t, false);
  const nxt = nextActor(t, seat);
  if (nxt == null) return finishStreet(t);
  t.toAct = nxt;
  return t;
}

function sweepBets(t: Table) {
  for (const s of t.seats) {
    t.pot += s.bet;
    s.bet = 0;
    s.acted = false;
    s.closed = false;
    s.lastAct = "";
  }
  t.currentBet = 0;
  t.lastRaiseSize = t.bb;
  t.raises = 0;
}

function canBetFurther(t: Table): boolean {
  return live(t).filter((s) => !s.allIn).length >= 2;
}

function finishStreet(t: Table): Table {
  sweepBets(t);
  const left = live(t);
  if (left.length <= 1) return award(t, false);
  if (!canBetFurther(t) || t.street === "river") {
    if (t.street !== "river") runout(t);
    return award(t, true);
  }
  const idx = STREETS.indexOf(t.street);
  t.street = STREETS[idx + 1]!;
  if (t.street === "flop") {
    draw(t, 1);
    t.board.push(...draw(t, 3));
    say(t, `Flop ${t.board.map(cardText).join(" ")}`);
  } else if (t.street === "turn") {
    draw(t, 1);
    t.board.push(...draw(t, 1));
    say(t, `Turn ${cardText(t.board[3]!)}`);
  } else {
    draw(t, 1);
    t.board.push(...draw(t, 1));
    say(t, `River ${cardText(t.board[4]!)}`);
  }
  if (!canBetFurther(t)) {
    if (t.street !== "river") return finishStreet(t);
    return award(t, true);
  }
  const first = nextSeat(t.button, (s) => s.inHand && !s.folded && !s.allIn, t.seats);
  t.toAct = first;
  if (t.toAct == null) return award(t, true);
  return t;
}

function runout(t: Table) {
  while (t.board.length < 5) {
    draw(t, 1);
    const need = t.board.length === 0 ? 3 : 1;
    t.board.push(...draw(t, need));
  }
  t.street = "river";
  say(t, `Mesa ${t.board.map(cardText).join(" ")}`);
}

interface Pot {
  amount: number;
  eligible: number[];
}

function buildPots(t: Table): Pot[] {
  const contrib = t.seats.filter((s) => s.totalPut > 0);
  const levels = [...new Set(contrib.map((s) => s.totalPut))].sort((a, b) => a - b);
  const pots: Pot[] = [];
  let prev = 0;
  for (const level of levels) {
    const donors = contrib.filter((s) => s.totalPut > prev);
    const amount = donors.reduce((sum, s) => sum + (Math.min(s.totalPut, level) - prev), 0);
    const eligible = donors.filter((s) => s.inHand && !s.folded).map((s) => s.seat);
    if (amount > 0) pots.push({ amount, eligible });
    prev = level;
  }
  return pots;
}

function bestSeats(t: Table, seats: number[]): { seats: number[]; hand?: HandValue } {
  if (!t.showCards) return { seats };
  let best = -1;
  let tied: number[] = [];
  let hand: HandValue | undefined;
  for (const seat of seats) {
    const p = t.seats[seat]!;
    if (!p.hole) continue;
    const value = evaluate([...p.hole, ...t.board]);
    if (value.score > best) {
      best = value.score;
      tied = [seat];
      hand = value;
    } else if (value.score === best) tied.push(seat);
  }
  return { seats: tied, hand };
}

function splitOrder(seats: number[], button: number): number[] {
  return [...seats].sort((a, b) => ((a - button + 6) % 6) - ((b - button + 6) % 6));
}

function award(t: Table, showdown: boolean): Table {
  t.showCards = showdown && t.board.length >= 5;
  if (showdown && t.board.length < 5) runout(t);
  t.showCards = showdown;
  t.toAct = null;
  const pots = buildPots(t);
  const gained = new Map<number, number>();
  for (const pot of pots) {
    if (pot.eligible.length === 0 || pot.amount <= 0) continue;
    const winners = t.showCards ? bestSeats(t, pot.eligible).seats : pot.eligible;
    const order = splitOrder(winners, t.button);
    const base = Math.floor(pot.amount / order.length);
    let rem = pot.amount % order.length;
    for (const seat of order) {
      const part = base + (rem > 0 ? 1 : 0);
      if (rem > 0) rem -= 1;
      t.seats[seat]!.stack += part;
      gained.set(seat, (gained.get(seat) ?? 0) + part);
    }
  }

  const winners: Winner[] = [];
  for (const [seat, amount] of gained) {
    const p = t.seats[seat]!;
    const net = amount - p.totalPut;
    let hand: string | undefined;
    if (t.showCards && p.hole && t.board.length >= 5) {
      hand = evaluate([...p.hole, ...t.board]).name;
    }
    if (net > 0 || (t.showCards && amount > 0)) winners.push({ seat, amount, net, hand });
  }
  winners.sort((a, b) => b.net - a.net);
  t.winners = winners;

  const positive = winners.filter((w) => w.net > 0);
  if (!t.showCards && positive.length === 1) {
    const w = positive[0]!;
    t.banner = `${t.seats[w.seat]!.name} gana ${w.net} sin mostrar`;
  } else if (positive.length === 1) {
    const w = positive[0]!;
    t.banner = `${t.seats[w.seat]!.name} gana ${w.net}${w.hand ? ` con ${w.hand.toLowerCase()}` : ""}`;
  } else if (positive.length > 1) {
    t.banner = "Bote dividido";
  } else if (winners.length) {
    t.banner = "Las cartas se reparten el bote";
  } else {
    t.banner = "Mano cerrada";
  }
  say(t, t.banner);

  const wonPot = [...gained.values()].reduce((a, b) => a + b, 0);
  for (const s of t.seats) {
    s.bet = 0;
    s.totalPut = 0;
  }
  t.pot = wonPot;
  t.currentBet = 0;
  t.phase = "between";
  return t;
}

export function heroSeat(t: Table): Seat {
  const hero = t.seats.find((s) => s.isHero);
  if (!hero) throw new Error("Sin héroe");
  return hero;
}

export function positionOf(t: Table, seat: number): string {
  if (seat === t.button) return "BTN";
  if (seat === t.sbSeat) return "SB";
  if (seat === t.bbSeat) return "BB";
  const d = (seat - t.button + 6) % 6;
  if (d === 3) return "UTG";
  if (d === 4) return "MP";
  if (d === 5) return "CO";
  return "";
}

export function boardText(t: Table): string {
  return t.board.map(cardText).join(" ");
}
