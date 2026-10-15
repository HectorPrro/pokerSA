import assert from "node:assert/strict";
import test from "node:test";
import type { Card, Rank, Suit } from "./cards.ts";
import { evaluate, evaluate5 } from "./eval.ts";
import { applyAction, chipSum, createTable, legalActions, startHand, type Act, type Table } from "./engine.ts";
import { chooseAction } from "./ai.ts";

function c(r: Rank, s: Suit): Card {
  return { r, s };
}

test("escalera real gana a escalera de color y el wheel es al cinco", () => {
  const royal = evaluate5([c(14, "h"), c(13, "h"), c(12, "h"), c(11, "h"), c(10, "h")]);
  const steel = evaluate5([c(9, "s"), c(8, "s"), c(7, "s"), c(6, "s"), c(5, "s")]);
  const wheel = evaluate5([c(14, "d"), c(2, "c"), c(3, "h"), c(4, "s"), c(5, "d")]);
  const six = evaluate5([c(6, "d"), c(2, "c"), c(3, "h"), c(4, "s"), c(5, "d")]);
  assert.equal(royal.name, "Escalera real");
  assert.ok(royal.score > steel.score);
  assert.equal(wheel.name, "Escalera al cinco");
  assert.ok(six.score > wheel.score);
  assert.ok(steel.score > quadsScore());
});

function quadsScore(): number {
  return evaluate5([c(8, "s"), c(8, "h"), c(8, "d"), c(8, "c"), c(3, "h")]).score;
}

test("póker, full, color, escalera, trío, dobles y pareja se ordenan", () => {
  const quads = evaluate5([c(8, "s"), c(8, "h"), c(8, "d"), c(8, "c"), c(3, "h")]);
  const boat = evaluate5([c(13, "s"), c(13, "h"), c(13, "d"), c(4, "c"), c(4, "h")]);
  const flush = evaluate5([c(14, "c"), c(11, "c"), c(8, "c"), c(5, "c"), c(2, "c")]);
  const straight = evaluate5([c(10, "s"), c(9, "h"), c(8, "d"), c(7, "c"), c(6, "s")]);
  const trips = evaluate5([c(7, "s"), c(7, "h"), c(7, "d"), c(14, "c"), c(2, "h")]);
  const two = evaluate5([c(12, "s"), c(12, "h"), c(9, "d"), c(9, "c"), c(4, "s")]);
  const pair = evaluate5([c(14, "s"), c(14, "h"), c(9, "d"), c(6, "c"), c(2, "s")]);
  const high = evaluate5([c(14, "s"), c(13, "h"), c(9, "d"), c(6, "c"), c(2, "s")]);
  const scores = [quads, boat, flush, straight, trips, two, pair, high].map((h) => h.score);
  const sorted = [...scores].sort((a, b) => b - a);
  assert.deepEqual(scores, sorted);
  assert.equal(quads.name, "Póker de ochos");
  assert.ok(pair.score > high.score);
});

test("el kicker del rey gana cuando la pareja es la misma", () => {
  const board = [c(14, "c"), c(7, "d"), c(2, "s"), c(9, "h"), c(3, "c")];
  const ak = evaluate([c(14, "s"), c(13, "h"), ...board]);
  const aq = evaluate([c(14, "d"), c(12, "s"), ...board]);
  assert.ok(ak.score > aq.score);
  assert.match(ak.name, /Pareja de ases/);
  assert.match(aq.name, /Pareja de ases/);
});

test("el board reparte la escalera", () => {
  const board = [c(14, "s"), c(13, "h"), c(12, "d"), c(11, "c"), c(10, "s")];
  const a = evaluate([c(2, "h"), c(3, "d"), ...board]);
  const b = evaluate([c(7, "c"), c(8, "h"), ...board]);
  assert.equal(a.score, b.score);
  assert.equal(a.name, "Escalera al as");
  const royalBoard = [c(14, "h"), c(13, "h"), c(12, "h"), c(11, "h"), c(10, "h")];
  const royal = evaluate([c(2, "c"), c(3, "d"), ...royalBoard]);
  assert.equal(royal.name, "Escalera real");
});

function scripted(): { table: Table; deck: Card[] } {
  const deck: Card[] = [
    c(2, "c"),
    c(7, "d"),
    c(14, "s"),
    c(9, "h"),
    c(8, "c"),
    c(14, "h"),
    c(3, "s"),
    c(2, "d"),
    c(4, "h"),
    c(13, "d"),
    c(13, "c"),
    c(5, "s"),
    c(6, "h"),
    c(10, "d"),
    c(11, "c"),
    c(12, "s"),
  ];
  while (deck.length < 52) deck.push(c(2, "h"));
  const table = createTable({
    sb: 1,
    bb: 2,
    button: 5,
    seats: [
      { name: "Alex", stack: 200, isHero: true, style: "human" },
      { name: "Nico", stack: 200, style: "nit" },
      { name: "Vera", stack: 200, style: "tag" },
      { name: "Mateo", stack: 40, style: "lag" },
      { name: "Lola", stack: 200, style: "station" },
      { name: "Hugo", stack: 200, style: "maniac" },
    ],
  });
  return { table, deck };
}

test("ciegas, orden de acción y subida mínima", () => {
  const { table, deck } = scripted();
  const t = startHand(table, { advance: false, rebuy: false, deck });
  assert.equal(t.sbSeat, 0);
  assert.equal(t.bbSeat, 1);
  assert.equal(t.toAct, 2);
  assert.equal(t.seats[0]!.bet, 1);
  assert.equal(t.seats[1]!.bet, 2);
  assert.equal(chipSum(t), 200 * 5 + 40);
  const legal = legalActions(t, 2);
  assert.equal(legal.minRaise, 4);
  assert.equal(legal.check, false);
  const raised = applyAction(t, 2, { kind: "raise", to: 6 });
  assert.equal(raised.toAct, 3);
  assert.equal(legalActions(raised, 3).call, 6);
});

test("all-in corto no reabre al que ya habló", () => {
  const { table, deck } = scripted();
  table.seats[3]!.stack = 8;
  let t = startHand(table, { advance: false, rebuy: false, deck });
  t = applyAction(t, 2, { kind: "raise", to: 6 });
  t = applyAction(t, 3, { kind: "raise", to: 8 });
  assert.equal(t.seats[3]!.allIn, true);
  assert.equal(t.seats[2]!.closed, true);
  let guard = 0;
  while (t.phase === "betting" && t.toAct !== 2 && guard < 8) {
    guard += 1;
    const seat = t.toAct!;
    const legal = legalActions(t, seat);
    const act: Act = legal.fold ? { kind: "fold" } : legal.check ? { kind: "check" } : { kind: "call" };
    t = applyAction(t, seat, act);
  }
  assert.equal(t.toAct, 2);
  const back = legalActions(t, 2);
  assert.equal(back.minRaise, null);
  assert.equal(back.call, 2);
});

test("el bote lateral paga al stack corto y conserva las fichas", () => {
  const deck: Card[] = [
    c(9, "c"),
    c(6, "h"),
    c(14, "s"),
    c(4, "d"),
    c(5, "c"),
    c(14, "h"),
    c(2, "s"),
    c(13, "h"),
    c(8, "c"),
    c(3, "d"),
    c(10, "c"),
    c(7, "s"),
    c(11, "d"),
    c(2, "d"),
  ];
  const used = new Set(deck.map((card) => `${card.r}${card.s}`));
  for (const s of ["s", "h", "d", "c"] as const) {
    for (let r = 2; r <= 14; r++) {
      const key = `${r}${s}`;
      if (!used.has(key)) deck.push(c(r as Rank, s));
    }
  }
  const table = createTable({
    sb: 5,
    bb: 10,
    button: 0,
    seats: [
      { name: "Corto", stack: 50, isHero: true, style: "human" },
      { name: "Medio", stack: 150, style: "tag" },
      { name: "Fondo", stack: 400, style: "tag" },
      { name: "X", stack: 0, style: "nit", sittingOut: true },
      { name: "Y", stack: 0, style: "nit", sittingOut: true },
      { name: "Z", stack: 0, style: "nit", sittingOut: true },
    ],
  });
  let t = startHand(table, { advance: false, rebuy: false, deck });
  const start = chipSum(t);
  assert.equal(t.toAct, 0);
  t = applyAction(t, 0, { kind: "raise", to: 50 });
  t = applyAction(t, 1, { kind: "raise", to: 150 });
  assert.equal(t.toAct, 2);
  t = applyAction(t, 2, { kind: "call" });
  assert.equal(t.phase, "between");
  assert.equal(chipSum(t), start);
  const corto = t.winners.find((w) => w.seat === 0);
  const medio = t.winners.find((w) => w.seat === 1);
  assert.equal(corto?.net, 100);
  assert.equal(medio?.net, 50);
  assert.equal(t.showCards, true);
  assert.match(corto?.hand ?? "", /Pareja de ases/);
});

test("cien manos no tiran fichas ni lanzan acciones ilegales", () => {
  let t = createTable({
    sb: 1,
    bb: 2,
    button: 1,
    seats: [
      { name: "Alex", stack: 500, isHero: true, style: "human" },
      { name: "Nico", stack: 500, style: "nit" },
      { name: "Vera", stack: 500, style: "tag" },
      { name: "Mateo", stack: 500, style: "lag" },
      { name: "Lola", stack: 500, style: "station" },
      { name: "Hugo", stack: 500, style: "maniac" },
    ],
  });
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  let seed = 7;
  t = startHand(t, { advance: false, rebuy: false, rng });
  let hands = 0;
  while (hands < 100 && t.phase !== "bust") {
    let guard = 0;
    while (t.phase === "betting" && guard < 40) {
      guard += 1;
      const seat = t.toAct;
      assert.notEqual(seat, null);
      const before = chipSum(t);
      const act = chooseAction(t, seat!, rng);
      t = applyAction(t, seat!, act);
      assert.equal(chipSum(t), before);
      for (const s of t.seats) assert.ok(s.stack >= 0);
    }
    assert.equal(t.phase, "between");
    assert.equal(
      t.seats.reduce((a, s) => a + s.stack, 0),
      3000,
    );
    hands += 1;
    t = startHand(t, { advance: true, rebuy: false, rng });
  }
  assert.ok(hands > 10);
});
