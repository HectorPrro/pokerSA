import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Volume2, t as VolumeX } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D9sWnAKA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUITS = [
	"s",
	"h",
	"d",
	"c"
];
var RANKS = [
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14
];
var SUIT_CHAR = {
	s: "♠",
	h: "♥",
	d: "♦",
	c: "♣"
};
var RANK_CHAR = {
	11: "J",
	12: "Q",
	13: "K",
	14: "A"
};
var RANK_ONE = {
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
	2: "dos"
};
var RANK_MANY = {
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
	2: "doses"
};
function rankChar(r) {
	return RANK_CHAR[r] ?? String(r);
}
function rankOne(r) {
	return RANK_ONE[r] ?? String(r);
}
function rankMany(r) {
	return RANK_MANY[r] ?? String(r);
}
function cardText(c) {
	return `${rankChar(c.r)}${SUIT_CHAR[c.s]}`;
}
function suitLabel(s) {
	return {
		s: "picas",
		h: "corazones",
		d: "diamantes",
		c: "tréboles"
	}[s];
}
function cardLabel(c) {
	return `${rankOne(c.r)} de ${suitLabel(c.s)}`;
}
function isRed(s) {
	return s === "h" || s === "d";
}
function makeDeck() {
	const deck = [];
	for (const s of SUITS) for (const r of RANKS) deck.push({
		r,
		s
	});
	return deck;
}
function shuffle(deck, rng = Math.random) {
	const a = deck.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		const tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}
	return a;
}
function chips(n) {
	return new Intl.NumberFormat("es-ES").format(Math.max(0, Math.round(n)));
}
function preflopLabel(a, b) {
	const hi = a.r >= b.r ? a : b;
	const lo = a.r >= b.r ? b : a;
	if (hi.r === lo.r) return `Pareja de ${rankMany(hi.r)}`;
	const suited = hi.s === lo.s;
	return `${cap(rankOne(hi.r))}-${rankOne(lo.r)} ${suited ? "suited" : "offsuit"}`;
}
function cap(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}
var STAKES = [
	{
		id: "baja",
		name: "Mesa Baja",
		sb: 1,
		bb: 2,
		min: 80,
		max: 400,
		note: "La mesa de entrada. Los errores salen baratos."
	},
	{
		id: "media",
		name: "Mesa Media",
		sb: 5,
		bb: 10,
		min: 400,
		max: 2e3,
		note: "Donde se sientan los regulares de la casa."
	},
	{
		id: "alta",
		name: "Mesa Alta",
		sb: 25,
		bb: 50,
		min: 2e3,
		max: 1e4,
		note: "Stacks profundos. Cada calle pesa."
	}
];
var REGULARS = [
	{
		name: "Nico",
		style: "nit",
		tag: "Cerrado"
	},
	{
		name: "Vera",
		style: "tag",
		tag: "Selectiva"
	},
	{
		name: "Mateo",
		style: "lag",
		tag: "Agresivo"
	},
	{
		name: "Lola",
		style: "station",
		tag: "Pega"
	},
	{
		name: "Hugo",
		style: "maniac",
		tag: "Suelto"
	}
];
var STARTING_BANK = 1e4;
var RELOAD = 5e3;
var SAVE_KEY = "rio-holdem-v1";
var DEFAULT_SAVE = {
	version: 1,
	name: "Alex",
	bankroll: STARTING_BANK,
	sound: true,
	stats: {
		hands: 0,
		won: 0,
		best: 0
	},
	session: null
};
function stakeById(id) {
	return STAKES.find((s) => s.id === id);
}
function Lobby({ save, onName, onSit, onReload, onToggleSound }) {
	const [picked, setPicked] = (0, import_react.useState)("media");
	const stake = STAKES.find((s) => s.id === picked) ?? STAKES[1];
	const cap = Math.min(stake.max, save.bankroll);
	const open = save.bankroll >= stake.min;
	const [buyIn, setBuyIn] = (0, import_react.useState)(() => Math.min(STAKES[1].max, Math.max(STAKES[1].min, STAKES[1].bb * 100)));
	const amount = Math.min(cap, Math.max(stake.min, buyIn));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "room mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl tracking-wide text-gold",
				children: "RÍO"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-ghost min-h-11 px-3",
					onClick: onToggleSound,
					children: save.sound ? "Sonido" : "Silencio"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded-full border border-line bg-wood px-3 py-2 text-sm tabular-nums",
					children: ["Banco ", chips(save.bankroll)]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 grid items-start gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-5xl leading-none text-cream md:text-7xl",
					children: "RÍO"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-lg text-gold",
					children: "No-Limit Hold'em"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-md text-muted",
					children: "Seis asientos, ciegas vivas y un mazo que no se ve. Los regulares no te regalan nada. Fichas de juego: aquí no se apuesta dinero."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-6 block text-sm text-muted",
					htmlFor: "nombre",
					children: "Tu nombre en la mesa"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "nombre",
					value: save.name,
					maxLength: 16,
					onChange: (event) => onName(event.target.value),
					className: "mt-2 w-full max-w-xs rounded-lg border border-line bg-wood px-3 py-3 text-cream"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-6 grid max-w-sm grid-cols-3 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Manos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-display text-2xl tabular-nums",
							children: save.stats.hands
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Ganadas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-display text-2xl tabular-nums",
							children: save.stats.won
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Mejor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-display text-2xl tabular-nums",
							children: chips(save.stats.best)
						})] })
					]
				}),
				save.bankroll < 500 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn btn-gold mt-6",
					onClick: onReload,
					children: ["Recarga de cortesía · ", chips(5e3)]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [STAKES.map((item) => {
					const locked = save.bankroll < item.min;
					const active = item.id === stake.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: locked,
						onClick: () => {
							setPicked(item.id);
							const nextCap = Math.min(item.max, save.bankroll);
							setBuyIn(Math.min(nextCap, Math.max(item.min, item.bb * 100)));
						},
						className: `rounded-2xl border px-4 py-4 text-left ${active ? "border-gold bg-wood" : "border-line bg-wood/60"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "tabular-nums text-gold",
									children: [
										chips(item.sb),
										"/",
										chips(item.bb)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: item.note
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm tabular-nums",
								children: [
									"Entrada ",
									chips(item.min),
									"–",
									chips(item.max),
									locked ? " · te falta banco" : ""
								]
							})
						]
					}, item.id);
				}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-line bg-rail p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Fichas para sentarte"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl tabular-nums",
								children: chips(amount)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-3 w-full accent-gold",
							type: "range",
							min: stake.min,
							max: cap,
							step: stake.bb,
							value: amount,
							"aria-label": "Entrada",
							onChange: (event) => setBuyIn(Number(event.target.value))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn btn-gold mt-4 w-full",
							onClick: () => onSit(stake, amount),
							children: ["Sentarme en ", stake.name]
						})
					]
				})]
			})]
		})]
	});
}
var CAT = 15 ** 5;
function pack(ranks) {
	return ranks.reduce((acc, r) => acc * 15 + r, 0);
}
function straightHigh(ranks) {
	const uniq = [...new Set(ranks)].sort((a, b) => a - b);
	if (uniq.length !== 5) return 0;
	if (uniq[4] - uniq[0] === 4) return uniq[4];
	if (uniq.join(",") === "2,3,4,5,14") return 5;
	return 0;
}
function evaluate5(cards) {
	const ranksDesc = cards.map((c) => c.r).sort((a, b) => b - a);
	const flush = cards.every((c) => c.s === cards[0].s);
	const counts = /* @__PURE__ */ new Map();
	for (const r of ranksDesc) counts.set(r, (counts.get(r) ?? 0) + 1);
	const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
	const high = straightHigh(ranksDesc);
	const suit = cards[0].s;
	if (flush && high) {
		const royal = high === 14;
		return {
			cat: 8,
			score: 8 * CAT + high,
			name: royal ? "Escalera real" : `Escalera de color al ${rankOne(high)}`
		};
	}
	if (groups[0][1] === 4) {
		const quad = groups[0][0];
		const kicker = groups[1][0];
		return {
			cat: 7,
			score: 7 * CAT + quad * 15 + kicker,
			name: `Póker de ${rankMany(quad)}`
		};
	}
	if (groups[0][1] === 3 && groups[1][1] === 2) return {
		cat: 6,
		score: 6 * CAT + groups[0][0] * 15 + groups[1][0],
		name: `Full de ${rankMany(groups[0][0])} y ${rankMany(groups[1][0])}`
	};
	if (flush) return {
		cat: 5,
		score: 5 * CAT + pack(ranksDesc),
		name: `Color de ${suitName(suit)}, ${rankOne(ranksDesc[0])}`
	};
	if (high) return {
		cat: 4,
		score: 4 * CAT + high,
		name: `Escalera al ${rankOne(high)}`
	};
	if (groups[0][1] === 3) {
		const kickers = groups.slice(1).map((g) => g[0]);
		return {
			cat: 3,
			score: 3 * CAT + groups[0][0] * 225 + pack(kickers),
			name: `Trío de ${rankMany(groups[0][0])}`
		};
	}
	if (groups[0][1] === 2 && groups[1][1] === 2) {
		const hi = Math.max(groups[0][0], groups[1][0]);
		const lo = Math.min(groups[0][0], groups[1][0]);
		const kicker = groups[2][0];
		return {
			cat: 2,
			score: 2 * CAT + hi * 225 + lo * 15 + kicker,
			name: `Doble pareja, ${rankMany(hi)} y ${rankMany(lo)}`
		};
	}
	if (groups[0][1] === 2) {
		const kickers = groups.slice(1).map((g) => g[0]);
		return {
			cat: 1,
			score: 1 * CAT + groups[0][0] * 3375 + pack(kickers),
			name: `Pareja de ${rankMany(groups[0][0])}`
		};
	}
	return {
		cat: 0,
		score: pack(ranksDesc),
		name: `Carta alta, ${rankOne(ranksDesc[0])}`
	};
}
function suitName(s) {
	return {
		s: "picas",
		h: "corazones",
		d: "diamantes",
		c: "tréboles"
	}[s];
}
function combinations(cards, k) {
	const out = [];
	const cur = [];
	const walk = (start) => {
		if (cur.length === k) {
			out.push(cur.slice());
			return;
		}
		for (let i = start; i < cards.length; i++) {
			cur.push(cards[i]);
			walk(i + 1);
			cur.pop();
		}
	};
	walk(0);
	return out;
}
function evaluate(cards) {
	if (cards.length < 5) return {
		cat: 0,
		score: 0,
		name: "Mano incompleta"
	};
	if (cards.length === 5) return evaluate5(cards);
	let best = null;
	for (const combo of combinations(cards, 5)) {
		const value = evaluate5(combo);
		if (!best || value.score > best.score) best = value;
	}
	return best;
}
function draws(cards) {
	if (cards.length < 3 || cards.length >= 7) return [];
	const found = [];
	const suitCounts = /* @__PURE__ */ new Map();
	for (const c of cards) suitCounts.set(c.s, (suitCounts.get(c.s) ?? 0) + 1);
	if (![...suitCounts.values()].some((n) => n >= 5) && [...suitCounts.values()].some((n) => n === 4)) found.push("color");
	if (!(cards.length >= 5 ? evaluate(cards).cat >= 4 : false)) {
		const set = new Set(cards.map((c) => c.r));
		if (set.has(14)) set.add(1);
		let open = false;
		let gut = false;
		for (let low = 1; low <= 10; low++) {
			let have = 0;
			let miss = 0;
			for (let k = 0; k < 5; k++) if (set.has(low + k)) have++;
			else miss = low + k;
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
function describeHolding(hole, board) {
	if (board.length < 3) return "";
	const value = evaluate([...hole, ...board]);
	const d = draws([...hole, ...board]);
	if (value.cat === 0 && d.length) {
		if (d.includes("color") && d.includes("abierta")) return "Proyecto de color y escalera";
		if (d.includes("color")) return "Proyecto de color";
		if (d.includes("abierta")) return "Proyecto de escalera abierta";
		return "Proyecto de escalera interna";
	}
	if (value.cat > 0 && value.cat < 4 && d.includes("color") && board.length < 5) return `${value.name} · proyecto de color`;
	return value.name;
}
var STREETS = [
	"preflop",
	"flop",
	"turn",
	"river"
];
function potTotal(t) {
	return t.seats.reduce((sum, s) => sum + s.totalPut, 0);
}
function displayPot(t) {
	if (t.phase === "between" || t.phase === "bust") return t.pot;
	return potTotal(t);
}
function createTable(opts) {
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
			lastAct: ""
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
		banner: ""
	};
}
function say(t, line) {
	t.log = [...t.log, line].slice(-30);
}
function nextSeat(from, pred, seats) {
	for (let i = 1; i <= 6; i++) {
		const idx = (from + i) % 6;
		if (pred(seats[idx])) return idx;
	}
	return null;
}
function live(t) {
	return t.seats.filter((s) => s.inHand && !s.folded);
}
function bettingDone(t) {
	const inHand = live(t);
	if (inHand.length <= 1) return true;
	return inHand.every((s) => s.allIn || s.acted && s.bet === t.currentBet);
}
function nextActor(t, from) {
	if (bettingDone(t)) return null;
	return nextSeat(from, (s) => s.inHand && !s.folded && !s.allIn && !(s.acted && s.bet === t.currentBet), t.seats);
}
function draw(t, n) {
	const cards = t.deck.slice(t.di, t.di + n);
	if (cards.length < n) throw new Error("Mazo agotado");
	t.di += n;
	return cards;
}
function post(t, seat, amount, label) {
	const p = t.seats[seat];
	const pay = Math.min(p.stack, amount);
	p.stack -= pay;
	p.bet += pay;
	p.totalPut += pay;
	if (p.stack === 0) p.allIn = true;
	p.lastAct = label;
	say(t, `${p.name} pone la ${label} (${pay})`);
}
function startHand(src, opts = {}) {
	const t = structuredClone(src);
	const rng = opts.rng ?? Math.random;
	const hero = t.seats.find((s) => s.isHero);
	for (const s of t.seats) if (!s.isHero && !s.sittingOut && s.stack < t.bb && opts.rebuy !== false) {
		const bbCount = 40 + Math.floor(rng() * 61);
		s.stack = t.bb * bbCount;
		say(t, `${s.name} vuelve a entrar con ${s.stack}`);
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
	t.currentBet = Math.max(t.seats[sbSeat].bet, t.seats[bbSeat].bet);
	t.pot = 0;
	const order = [];
	for (let round = 0; round < 2; round++) for (let i = 0; i < 6; i++) {
		const idx = (sbSeat + i) % 6;
		if (t.seats[idx].inHand) order.push(idx);
	}
	const holes = /* @__PURE__ */ new Map();
	for (const idx of order) {
		const card = draw(t, 1)[0];
		const bag = holes.get(idx) ?? [];
		bag.push(card);
		holes.set(idx, bag);
	}
	for (const [idx, cards] of holes) t.seats[idx].hole = [cards[0], cards[1]];
	say(t, `Mano ${t.handNo}. Botón en ${t.seats[t.button].name}.`);
	t.toAct = nextActor(t, bbSeat);
	if (t.toAct == null) return finishStreet(t);
	return t;
}
function legalActions(t, seat) {
	const none = {
		fold: false,
		check: false,
		call: 0,
		minRaise: null,
		maxRaise: null
	};
	const p = t.seats[seat];
	if (!p || t.phase !== "betting" || t.toAct !== seat || !p.inHand || p.folded || p.allIn) return none;
	const toCall = Math.max(0, t.currentBet - p.bet);
	const max = p.bet + p.stack;
	const check = toCall === 0;
	const call = toCall > 0 ? Math.min(toCall, p.stack) : 0;
	let minRaise = null;
	let maxRaise = null;
	if (p.stack > toCall && !p.closed) {
		maxRaise = max;
		if (t.currentBet === 0) minRaise = Math.min(t.bb, max);
		else {
			const fullTo = t.currentBet + t.lastRaiseSize;
			minRaise = max >= fullTo ? fullTo : max;
		}
	}
	return {
		fold: toCall > 0,
		check,
		call,
		minRaise,
		maxRaise
	};
}
function payTo(p, to) {
	const add = to - p.bet;
	if (add < 0 || add > p.stack) throw new Error("Apuesta imposible");
	p.stack -= add;
	p.bet = to;
	p.totalPut += add;
	if (p.stack === 0) p.allIn = true;
}
function applyAction(src, seat, act) {
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
			for (const o of t.seats) if (o.seat !== seat && o.inHand && !o.folded && !o.allIn) {
				o.acted = false;
				o.closed = false;
			}
		} else {
			for (const o of t.seats) if (o.seat !== seat && o.acted) o.closed = true;
			t.currentBet = to;
		}
		p.lastAct = p.allIn ? "All-in" : opening ? "Apuesta" : "Sube";
		say(t, opening ? `${p.name} apuesta ${to}` : `${p.name} sube a ${to}`);
	}
	if (live(t).length <= 1) return award(t, false);
	const nxt = nextActor(t, seat);
	if (nxt == null) return finishStreet(t);
	t.toAct = nxt;
	return t;
}
function sweepBets(t) {
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
function canBetFurther(t) {
	return live(t).filter((s) => !s.allIn).length >= 2;
}
function finishStreet(t) {
	sweepBets(t);
	if (live(t).length <= 1) return award(t, false);
	if (!canBetFurther(t) || t.street === "river") {
		if (t.street !== "river") runout(t);
		return award(t, true);
	}
	t.street = STREETS[STREETS.indexOf(t.street) + 1];
	if (t.street === "flop") {
		draw(t, 1);
		t.board.push(...draw(t, 3));
		say(t, `Flop ${t.board.map(cardText).join(" ")}`);
	} else if (t.street === "turn") {
		draw(t, 1);
		t.board.push(...draw(t, 1));
		say(t, `Turn ${cardText(t.board[3])}`);
	} else {
		draw(t, 1);
		t.board.push(...draw(t, 1));
		say(t, `River ${cardText(t.board[4])}`);
	}
	if (!canBetFurther(t)) {
		if (t.street !== "river") return finishStreet(t);
		return award(t, true);
	}
	t.toAct = nextSeat(t.button, (s) => s.inHand && !s.folded && !s.allIn, t.seats);
	if (t.toAct == null) return award(t, true);
	return t;
}
function runout(t) {
	while (t.board.length < 5) {
		draw(t, 1);
		const need = t.board.length === 0 ? 3 : 1;
		t.board.push(...draw(t, need));
	}
	t.street = "river";
	say(t, `Mesa ${t.board.map(cardText).join(" ")}`);
}
function buildPots(t) {
	const contrib = t.seats.filter((s) => s.totalPut > 0);
	const levels = [...new Set(contrib.map((s) => s.totalPut))].sort((a, b) => a - b);
	const pots = [];
	let prev = 0;
	for (const level of levels) {
		const donors = contrib.filter((s) => s.totalPut > prev);
		const amount = donors.reduce((sum, s) => sum + (Math.min(s.totalPut, level) - prev), 0);
		const eligible = donors.filter((s) => s.inHand && !s.folded).map((s) => s.seat);
		if (amount > 0) pots.push({
			amount,
			eligible
		});
		prev = level;
	}
	return pots;
}
function bestSeats(t, seats) {
	if (!t.showCards) return { seats };
	let best = -1;
	let tied = [];
	let hand;
	for (const seat of seats) {
		const p = t.seats[seat];
		if (!p.hole) continue;
		const value = evaluate([...p.hole, ...t.board]);
		if (value.score > best) {
			best = value.score;
			tied = [seat];
			hand = value;
		} else if (value.score === best) tied.push(seat);
	}
	return {
		seats: tied,
		hand
	};
}
function splitOrder(seats, button) {
	return [...seats].sort((a, b) => (a - button + 6) % 6 - (b - button + 6) % 6);
}
function award(t, showdown) {
	t.showCards = showdown && t.board.length >= 5;
	if (showdown && t.board.length < 5) runout(t);
	t.showCards = showdown;
	t.toAct = null;
	const pots = buildPots(t);
	const gained = /* @__PURE__ */ new Map();
	for (const pot of pots) {
		if (pot.eligible.length === 0 || pot.amount <= 0) continue;
		const order = splitOrder(t.showCards ? bestSeats(t, pot.eligible).seats : pot.eligible, t.button);
		const base = Math.floor(pot.amount / order.length);
		let rem = pot.amount % order.length;
		for (const seat of order) {
			const part = base + (rem > 0 ? 1 : 0);
			if (rem > 0) rem -= 1;
			t.seats[seat].stack += part;
			gained.set(seat, (gained.get(seat) ?? 0) + part);
		}
	}
	const winners = [];
	for (const [seat, amount] of gained) {
		const p = t.seats[seat];
		const net = amount - p.totalPut;
		let hand;
		if (t.showCards && p.hole && t.board.length >= 5) hand = evaluate([...p.hole, ...t.board]).name;
		if (net > 0 || t.showCards && amount > 0) winners.push({
			seat,
			amount,
			net,
			hand
		});
	}
	winners.sort((a, b) => b.net - a.net);
	t.winners = winners;
	const positive = winners.filter((w) => w.net > 0);
	if (!t.showCards && positive.length === 1) {
		const w = positive[0];
		t.banner = `${t.seats[w.seat].name} gana ${w.net} sin mostrar`;
	} else if (positive.length === 1) {
		const w = positive[0];
		t.banner = `${t.seats[w.seat].name} gana ${w.net}${w.hand ? ` con ${w.hand.toLowerCase()}` : ""}`;
	} else if (positive.length > 1) t.banner = "Bote dividido";
	else if (winners.length) t.banner = "Las cartas se reparten el bote";
	else t.banner = "Mano cerrada";
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
function heroSeat(t) {
	const hero = t.seats.find((s) => s.isHero);
	if (!hero) throw new Error("Sin héroe");
	return hero;
}
function positionOf(t, seat) {
	if (seat === t.button) return "BTN";
	if (seat === t.sbSeat) return "SB";
	if (seat === t.bbSeat) return "BB";
	const d = (seat - t.button + 6) % 6;
	if (d === 3) return "UTG";
	if (d === 4) return "MP";
	if (d === 5) return "CO";
	return "";
}
function SuitMark({ suit, className }) {
	const props = {
		viewBox: "0 0 20 20",
		className,
		"aria-hidden": true
	};
	if (suit === "h") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M10 17s-6.2-3.9-6.2-8.2C3.8 6.2 5.7 4.6 7.6 4.6c1.2 0 2 .6 2.4 1.4.4-.8 1.2-1.4 2.4-1.4 1.9 0 3.8 1.6 3.8 4.2C16.2 13.1 10 17 10 17z"
		})
	});
	if (suit === "d") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M10 2.2 16.2 10 10 17.8 3.8 10 10 2.2z"
		})
	});
	if (suit === "c") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M10 3.2a2.7 2.7 0 0 1 1.2 5.1 2.6 2.6 0 1 1-2.4 4.2V16h2.4v1.4H8.8V12.5a2.6 2.6 0 1 1-2.4-4.2A2.7 2.7 0 0 1 10 3.2z"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M10 2c2.2 2.6 4.8 3.6 4.8 6.3 0 1.6-1 2.6-2.2 3 1 .3 2.4 1.2 2.4 2.8 0 2-1.8 3.4-4 3.4-.4 0-.7 0-1-.1V17h2.2V18.4H7.8V17H10v-.6c-.3.1-.6.1-1 .1-2.2 0-4-1.4-4-3.4 0-1.6 1.4-2.5 2.4-2.8-1.2-.4-2.2-1.4-2.2-3C5.2 5.6 7.8 4.6 10 2z"
		})
	});
}
function PlayingCard({ card, down = false, large = false, small = false }) {
	const size = large ? "card card-lg" : small ? "card card-sm" : "card";
	if (down || !card) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `${size} card-back`,
		"aria-hidden": "true"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${size} ${isRed(card.s) ? "card-red" : ""}`,
		role: "img",
		"aria-label": cardLabel(card),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "card-corner",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rankChar(card.r) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuitMark, { suit: card.s })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "card-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuitMark, { suit: card.s })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "card-corner card-corner-br",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rankChar(card.r) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuitMark, { suit: card.s })]
			})
		]
	});
}
function Chip({ amount }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `chip chip-${amount >= 1e3 ? "gold" : amount >= 500 ? "purple" : amount >= 100 ? "black" : amount >= 25 ? "green" : amount >= 5 ? "red" : "white"} tabular-nums`,
		children: chips(amount)
	});
}
var POS = [
	{
		left: "50%",
		top: "90%"
	},
	{
		left: "7%",
		top: "72%"
	},
	{
		left: "9%",
		top: "26%"
	},
	{
		left: "50%",
		top: "9%"
	},
	{
		left: "91%",
		top: "26%"
	},
	{
		left: "93%",
		top: "72%"
	}
];
var BET_AT = [
	"-top-8 left-1/2 -translate-x-1/2",
	"-right-2 top-1/2 translate-x-full -translate-y-1/2",
	"-right-2 top-1/2 translate-x-full -translate-y-1/2",
	"-bottom-8 left-1/2 -translate-x-1/2",
	"-left-2 top-1/2 -translate-x-full -translate-y-1/2",
	"-left-2 top-1/2 -translate-x-full -translate-y-1/2"
];
var STREET = {
	preflop: "Preflop",
	flop: "Flop",
	turn: "Turn",
	river: "Río"
};
function TableView({ table, stake, save, clock, onAct, onLeave, onNext, onRebuy, onToggleSound }) {
	const hero = heroSeat(table);
	const legal = table.toAct === hero.seat ? legalActions(table, hero.seat) : null;
	const yourTurn = Boolean(legal && table.phase === "betting");
	const [raising, setRaising] = (0, import_react.useState)(false);
	const [raiseTo, setRaiseTo] = (0, import_react.useState)(0);
	const [logOpen, setLogOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setRaising(false);
	}, [
		table.handNo,
		table.street,
		table.toAct
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const tag = event.target?.tagName;
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
	}, [
		yourTurn,
		legal,
		onAct
	]);
	const actor = table.toAct == null ? null : table.seats[table.toAct];
	const hole = hero.hole;
	const made = hole ? table.board.length >= 3 ? describeHolding(hole, table.board) : preflopLabel(hole[0], hole[1]) : "";
	const toCall = legal?.call ?? 0;
	const potNow = table.phase === "betting" ? potTotal(table) : displayPot(table);
	const odds = toCall > 0 ? (potNow + toCall) / toCall : 0;
	const need = toCall > 0 ? Math.round(100 * toCall / (potNow + toCall)) : 0;
	const cap = Math.min(stake.max, save.bankroll);
	const [rebuy, setRebuy] = (0, import_react.useState)(cap);
	(0, import_react.useEffect)(() => {
		setRebuy(Math.min(stake.max, Math.max(stake.min, save.bankroll)));
	}, [save.bankroll, stake]);
	const openRaise = () => {
		if (!legal?.minRaise) return;
		setRaiseTo(legal.minRaise);
		setRaising(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "room flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-2 px-3 py-3 md:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl text-gold",
						children: "RÍO"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-sm text-muted",
						children: [
							stake.name,
							" · ",
							chips(stake.sb),
							"/",
							chips(stake.bb),
							" · Mano ",
							table.handNo
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "hidden text-sm tabular-nums text-muted sm:block",
							children: ["Banco ", chips(save.bankroll)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-ghost min-h-11 px-3",
							onClick: onToggleSound,
							"aria-label": "Sonido",
							children: save.sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn min-h-11",
							onClick: onLeave,
							children: "Levantarse"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "felt-wrap",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "felt",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute top-1/2 left-1/2 flex w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-widest text-gold",
								children: STREET[table.street]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-widest text-muted",
								children: "BOTE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl leading-none tabular-nums md:text-5xl",
								children: chips(displayPot(table))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "board flex min-h-12 items-center justify-center gap-1",
								children: table.board.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, { card }, `${table.handNo}-${card.r}${card.s}`))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-xs text-center text-sm",
								"aria-live": "polite",
								children: table.banner || (actor && !actor.isHero ? `${actor.name} piensa` : yourTurn ? "Te toca" : "")
							})
						]
					}), table.seats.map((seat) => {
						if (seat.sittingOut && seat.stack <= 0 && !seat.isHero) return null;
						const win = table.winners.find((w) => w.seat === seat.seat && w.net > 0);
						const show = table.showCards && seat.hole && !seat.folded;
						const tag = REGULARS.find((r) => r.name === seat.name)?.tag;
						const pos = positionOf(table, seat.seat);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "seat",
							style: {
								left: POS[seat.seat].left,
								top: POS[seat.seat].top
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									seat.bet > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `absolute ${BET_AT[seat.seat]}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { amount: seat.bet })
									}),
									seat.seat === table.button && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute -top-3 -left-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "dealer",
											children: "D"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `plate ${table.toAct === seat.seat ? "plate-turn" : ""} ${win ? "plate-win" : ""} ${seat.folded ? "opacity-45" : ""}`,
										children: [
											!seat.isHero && seat.hole && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mb-1 flex justify-center gap-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
													card: show ? seat.hole[0] : null,
													down: !show,
													small: true
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
													card: show ? seat.hole[1] : null,
													down: !show,
													small: true
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "truncate text-sm font-semibold",
												children: [seat.name, seat.isHero ? " · tú" : ""]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted",
												children: [tag && !seat.isHero ? `${tag} · ` : "", pos === "SB" || pos === "BB" ? pos : ""]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "tabular-nums text-gold",
												children: chips(seat.stack)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "min-h-4 text-xs text-muted",
												children: seat.allIn ? "All-in" : seat.lastAct
											}),
											win && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm font-semibold tabular-nums text-gold",
												children: ["+", chips(win.net)]
											})
										]
									})
								]
							})
						}, seat.seat);
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex w-full max-w-3xl justify-end px-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-muted",
					onClick: () => setLogOpen((v) => !v),
					children: logOpen ? "Ocultar mano" : "Ver mano"
				})
			}),
			logOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mx-auto mb-2 max-h-28 w-full max-w-3xl overflow-auto px-4 text-sm text-muted",
				children: table.log.map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, `${index}-${line}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "dock mx-auto w-full max-w-3xl",
				children: [
					yourTurn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 h-1 overflow-hidden rounded-full bg-line",
						"aria-label": `Tiempo ${clock} segundos`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-gold",
							style: { width: `${clock / 20 * 100}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: hole ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
								card: hole[0],
								large: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
								card: hole[1],
								large: true
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
								down: true,
								large: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
								down: true,
								large: true
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-display text-xl",
									children: made || "Sin cartas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm tabular-nums text-muted",
									children: ["Stack ", chips(hero.stack)]
								}),
								toCall > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										"Cuota ",
										odds.toFixed(1),
										" a 1 · hace falta ",
										need,
										"%"
									]
								})
							]
						})]
					}),
					table.phase === "bust" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-sm",
							children: "Te quedaste sin fichas en esta mesa."
						}), save.bankroll >= stake.min ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "w-full accent-gold",
							type: "range",
							min: stake.min,
							max: cap,
							step: stake.bb,
							value: Math.min(cap, Math.max(stake.min, rebuy)),
							"aria-label": "Recompra",
							onChange: (event) => setRebuy(Number(event.target.value))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn btn-gold mt-3 w-full",
							onClick: () => onRebuy(Math.min(cap, Math.max(stake.min, rebuy))),
							children: ["Recomprar ", chips(Math.min(cap, Math.max(stake.min, rebuy)))]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "No te alcanza el banco. Levántate y pide la recarga de cortesía."
						})]
					}) : table.phase === "between" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-gold mt-3 w-full",
						onClick: onNext,
						children: "Siguiente mano"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						raising && legal?.minRaise != null && legal.maxRaise != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: presets(table, hero.seat).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "btn min-h-11 px-3",
										onClick: () => setRaiseTo(item.to),
										children: item.label
									}, item.label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "mt-3 w-full accent-gold",
									type: "range",
									min: legal.minRaise,
									max: legal.maxRaise,
									step: 1,
									value: Math.min(legal.maxRaise, Math.max(legal.minRaise, raiseTo)),
									"aria-label": "Tamaño de la subida",
									onChange: (event) => setRaiseTo(Number(event.target.value))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn btn-gold mt-3 w-full",
									onClick: () => {
										onAct({
											kind: "raise",
											to: Math.min(legal.maxRaise, Math.max(legal.minRaise, raiseTo))
										});
										setRaising(false);
									},
									children: ["Subir a ", chips(Math.min(legal.maxRaise, Math.max(legal.minRaise, raiseTo)))]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-3 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn text-sm",
									disabled: !yourTurn || !legal?.fold,
									onClick: () => onAct({ kind: "fold" }),
									children: "No ir"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn text-sm",
									disabled: !yourTurn || !legal?.check && !(legal && legal.call > 0),
									onClick: () => legal?.check ? onAct({ kind: "check" }) : onAct({ kind: "call" }),
									children: legal?.check ? "Pasar" : legal && legal.call > 0 ? `Igualar ${chips(legal.call)}` : "Igualar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-gold text-sm",
									disabled: !yourTurn || legal?.minRaise == null,
									onClick: () => {
										if (!legal?.minRaise || legal.maxRaise == null) return;
										if (legal.minRaise === legal.maxRaise) onAct({
											kind: "raise",
											to: legal.maxRaise
										});
										else openRaise();
									},
									children: legal?.minRaise != null && legal.minRaise === legal.maxRaise ? `All-in ${chips(legal.maxRaise)}` : table.currentBet === 0 ? "Apostar" : "Subir"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 hidden text-center text-xs text-muted md:block",
							children: "F no ir · C o espacio igualar · R subir"
						})
					] })
				]
			})
		]
	});
}
function presets(table, seat) {
	const legal = legalActions(table, seat);
	if (legal.minRaise == null || legal.maxRaise == null) return [];
	const player = table.seats[seat];
	const call = Math.max(0, table.currentBet - player.bet);
	const pot = potTotal(table);
	const size = (fraction) => {
		const inc = Math.max(table.bb, Math.round((pot + call) * fraction));
		const to = (table.currentBet === 0 ? 0 : table.currentBet) + inc;
		return Math.min(legal.maxRaise, Math.max(legal.minRaise, to));
	};
	const raw = [
		{
			label: "Mín",
			to: legal.minRaise
		},
		{
			label: "½",
			to: size(.5)
		},
		{
			label: "Bote",
			to: size(1)
		},
		{
			label: "All-in",
			to: legal.maxRaise
		}
	];
	const seen = /* @__PURE__ */ new Set();
	return raw.filter((item) => {
		if (seen.has(item.to)) return false;
		seen.add(item.to);
		return true;
	});
}
var PROFILES = {
	nit: {
		open: 12,
		call: 10,
		threeBet: 16,
		bluff: .04,
		value: .72,
		looseness: -.06,
		slowplay: .35
	},
	tag: {
		open: 9,
		call: 7,
		threeBet: 14,
		bluff: .12,
		value: .62,
		looseness: 0,
		slowplay: .18
	},
	lag: {
		open: 6,
		call: 4.5,
		threeBet: 10,
		bluff: .28,
		value: .52,
		looseness: .06,
		slowplay: .08
	},
	station: {
		open: 10,
		call: 3.5,
		threeBet: 17,
		bluff: .04,
		value: .78,
		looseness: .14,
		slowplay: .45
	},
	maniac: {
		open: 3,
		call: 1,
		threeBet: 6,
		bluff: .4,
		value: .4,
		looseness: .1,
		slowplay: .02
	}
};
function chen(a, b) {
	const hi = Math.max(a.r, b.r);
	const lo = Math.min(a.r, b.r);
	const base = (r) => r === 14 ? 10 : r === 13 ? 8 : r === 12 ? 7 : r === 11 ? 6 : r / 2;
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
function posTax(t, seat) {
	const d = (seat - t.button + 6) % 6;
	if (d === 0 || d === 5) return -2;
	if (d === 4) return -1;
	if (d === 3) return 2;
	if (d === 1) return 0;
	return 1;
}
function suitedConnector(a, b) {
	if (a.s !== b.s || a.r === b.r) return false;
	return Math.abs(a.r - b.r) === 1;
}
function handEquity(hole, board) {
	if (board.length < 3) return Math.max(.08, Math.min(.88, chen(hole[0], hole[1]) / 22));
	const cards = [...hole, ...board];
	const value = evaluate(cards);
	let eq = [
		.2,
		.46,
		.62,
		.7,
		.78,
		.84,
		.92,
		.97,
		.99
	][value.cat] ?? .2;
	if (value.cat === 1) {
		const boardRanks = board.map((c) => c.r).sort((a, b) => b - a);
		const top = boardRanks[0] ?? 0;
		if (hole[0].r === hole[1].r && hole[0].r > top) eq = .74;
		else if (hole[0].r === top || hole[1].r === top) eq = .58;
		else if (boardRanks[1] && (hole[0].r === boardRanks[1] || hole[1].r === boardRanks[1])) eq = .4;
		else eq = .3;
	}
	const suited = /* @__PURE__ */ new Map();
	for (const c of board) suited.set(c.s, (suited.get(c.s) ?? 0) + 1);
	const boardFlush = [...suited.values()].some((n) => n >= 3);
	const weFlush = value.cat === 5 || value.cat === 8;
	if (boardFlush && !weFlush && value.cat < 6) eq *= .78;
	if (board.length < 5 && value.cat < 4) {
		const d = draws(cards);
		if (d.includes("color")) eq += board.length === 3 ? .16 : .09;
		if (d.includes("abierta")) eq += board.length === 3 ? .13 : .08;
		else if (d.includes("interna")) eq += board.length === 3 ? .06 : .04;
	}
	return Math.max(.04, Math.min(.98, eq));
}
function raiseTo(t, seat, target) {
	const legal = legalActions(t, seat);
	if (legal.minRaise == null || legal.maxRaise == null) return target;
	return Math.min(legal.maxRaise, Math.max(legal.minRaise, Math.round(target)));
}
function potRaise(t, seat, fraction) {
	const p = t.seats[seat];
	const toCall = Math.max(0, t.currentBet - p.bet);
	const inc = Math.max(t.bb, Math.round((potTotal(t) + toCall) * fraction));
	return raiseTo(t, seat, (t.currentBet === 0 ? 0 : t.currentBet) + inc);
}
function fallback(t, seat) {
	const legal = legalActions(t, seat);
	if (legal.check) return { kind: "check" };
	if (legal.call > 0 && legal.call <= t.bb) return { kind: "call" };
	if (legal.fold) return { kind: "fold" };
	if (legal.call > 0) return { kind: "call" };
	return { kind: "check" };
}
function chooseAction(t, seat, rng = Math.random) {
	const p = t.seats[seat];
	const legal = legalActions(t, seat);
	if (!p?.hole || p.style === "human") return fallback(t, seat);
	const style = PROFILES[p.style];
	const hole = p.hole;
	const tax = posTax(t, seat);
	if (t.street === "preflop") {
		const score = chen(hole[0], hole[1]);
		const toCall = Math.max(0, t.currentBet - p.bet);
		if (toCall === 0) {
			if (legal.minRaise != null && score >= style.threeBet && rng() > .55) return {
				kind: "raise",
				to: raiseTo(t, seat, Math.max(t.bb * 3, t.currentBet * 3))
			};
			if (legal.check) return { kind: "check" };
		}
		if (t.raises === 0 && t.currentBet <= t.bb) {
			if (legal.minRaise != null && score >= style.open + tax) return {
				kind: "raise",
				to: raiseTo(t, seat, t.bb * 3)
			};
			if (legal.call > 0 && score >= style.open + tax - 3) return { kind: "call" };
			if (legal.fold) return { kind: "fold" };
			if (legal.check) return { kind: "check" };
			if (legal.call > 0) return { kind: "call" };
		}
		const pressure = t.raises >= 2 ? 3 : t.raises === 1 ? 1 : 0;
		if (legal.minRaise != null && score >= style.threeBet + pressure + Math.max(0, tax) && rng() > .28) return {
			kind: "raise",
			to: raiseTo(t, seat, t.currentBet * 3)
		};
		if (score >= style.call + pressure + Math.max(0, tax)) {
			if (legal.call > 0) return { kind: "call" };
			if (legal.check) return { kind: "check" };
		}
		if (suitedConnector(hole[0], hole[1]) && tax < 0 && toCall <= t.bb * 4 && legal.call > 0 && rng() < .7) return { kind: "call" };
		if (legal.fold) return { kind: "fold" };
		if (legal.check) return { kind: "check" };
		if (legal.call > 0) return { kind: "call" };
		return fallback(t, seat);
	}
	const eq = handEquity(hole, t.board) + style.looseness + (rng() - .5) * .08;
	const toCall = legal.call;
	const pot = potTotal(t);
	const price = toCall > 0 ? toCall / (pot + toCall) : 0;
	if (toCall > 0) {
		const valueRaise = eq >= style.value && legal.minRaise != null && rng() > style.slowplay && t.raises < 3;
		const bluff = eq < .3 && legal.minRaise != null && rng() < style.bluff && t.raises < 2;
		if (valueRaise || bluff) return {
			kind: "raise",
			to: potRaise(t, seat, eq > .85 ? 1 : .66)
		};
		if (eq + .02 >= price || toCall <= t.bb) {
			if (legal.call > 0) return { kind: "call" };
		}
		if (legal.fold) return { kind: "fold" };
		if (legal.call > 0) return { kind: "call" };
		if (legal.check) return { kind: "check" };
		return fallback(t, seat);
	}
	if (legal.minRaise != null && eq >= style.value && rng() > .22) return {
		kind: "raise",
		to: potRaise(t, seat, .66)
	};
	if (legal.minRaise != null && eq < .24 && rng() < style.bluff * .8) return {
		kind: "raise",
		to: potRaise(t, seat, .66)
	};
	if (legal.check) return { kind: "check" };
	return fallback(t, seat);
}
var ctx = null;
function context() {
	if (typeof window === "undefined") return null;
	if (!ctx) ctx = new AudioContext();
	return ctx;
}
function unlockAudio() {
	const audio = context();
	if (audio && audio.state === "suspended") audio.resume();
}
function resumeAudio() {
	const audio = context();
	if (audio && audio.state === "suspended") audio.resume();
}
function tone(freq, dur, type, gain, when = 0) {
	const audio = context();
	if (!audio) return;
	const osc = audio.createOscillator();
	const amp = audio.createGain();
	osc.type = type;
	osc.frequency.value = freq;
	const start = audio.currentTime + when;
	amp.gain.setValueAtTime(1e-4, start);
	amp.gain.exponentialRampToValueAtTime(gain, start + .015);
	amp.gain.exponentialRampToValueAtTime(1e-4, start + dur);
	osc.connect(amp);
	amp.connect(audio.destination);
	osc.start(start);
	osc.stop(start + dur + .02);
}
function playAction(kind) {
	if (kind === "deal") tone(740, .07, "triangle", .04);
	else if (kind === "check") tone(420, .06, "sine", .035);
	else if (kind === "fold") tone(196, .12, "sine", .04);
	else if (kind === "call") {
		tone(310, .07, "triangle", .05);
		tone(180, .09, "sine", .03);
	} else if (kind === "raise") {
		tone(520, .08, "triangle", .05);
		tone(260, .1, "sine", .035, .03);
	} else {
		tone(523, .12, "triangle", .05);
		tone(659, .14, "triangle", .045, .08);
		tone(784, .18, "sine", .04, .16);
	}
}
function loadSave() {
	if (typeof window === "undefined") return DEFAULT_SAVE;
	try {
		const raw = window.localStorage.getItem(SAVE_KEY);
		if (!raw) return DEFAULT_SAVE;
		const parsed = JSON.parse(raw);
		if (parsed.version !== 1 || typeof parsed.bankroll !== "number") return DEFAULT_SAVE;
		return {
			...DEFAULT_SAVE,
			...parsed,
			stats: {
				...DEFAULT_SAVE.stats,
				...parsed.stats
			},
			name: (parsed.name || "Alex").slice(0, 16)
		};
	} catch {
		return DEFAULT_SAVE;
	}
}
function botStack(bb, index) {
	return bb * (50 + index * 17 % 41);
}
function buildTable(name, stake, stack, button, handNo) {
	const seats = [{
		name: name.trim() || "Alex",
		stack,
		isHero: true,
		style: "human"
	}, ...REGULARS.map((r, i) => ({
		name: r.name,
		stack: botStack(stake.bb, i),
		style: r.style
	}))];
	const table = createTable({
		sb: stake.sb,
		bb: stake.bb,
		seats,
		button
	});
	table.handNo = handNo;
	return startHand(table, { advance: handNo > 0 });
}
function useRoom() {
	const [save, setSave] = (0, import_react.useState)(DEFAULT_SAVE);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [table, setTable] = (0, import_react.useState)(null);
	const [stakeId, setStakeId] = (0, import_react.useState)(null);
	const [clock, setClock] = (0, import_react.useState)(20);
	const tableRef = (0, import_react.useRef)(null);
	const saveRef = (0, import_react.useRef)(save);
	const settled = (0, import_react.useRef)(0);
	tableRef.current = table;
	saveRef.current = save;
	const write = (0, import_react.useCallback)((next) => {
		saveRef.current = next;
		setSave(next);
		try {
			window.localStorage.setItem(SAVE_KEY, JSON.stringify(next));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		const stored = loadSave();
		setSave(stored);
		saveRef.current = stored;
		if (stored.session) {
			const stake = stakeById(stored.session.stakeId);
			if (stake && stored.session.stack > 0) {
				setStakeId(stake.id);
				setTable(buildTable(stored.name, stake, stored.session.stack, stored.session.button, stored.session.handNo));
			} else write({
				...stored,
				session: null
			});
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
	(0, import_react.useEffect)(() => {
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
				best: Math.max(current.stats.best, net)
			},
			session: current.session ? {
				...current.session,
				stack: hero.stack,
				button: table.button,
				handNo: table.handNo
			} : current.session
		});
		if (current.sound && net > 0) playAction("win");
	}, [table, write]);
	(0, import_react.useEffect)(() => {
		if (!table || table.phase !== "betting" || table.toAct == null) return;
		const actor = table.seats[table.toAct];
		if (!actor || actor.isHero) return;
		const wait = 720 + Math.floor(Math.random() * 900);
		const id = window.setTimeout(() => {
			const live = tableRef.current;
			if (!live || live.phase !== "betting" || live.toAct !== actor.seat) return;
			let action;
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
				const backup = legal.check ? { kind: "check" } : legal.fold ? { kind: "fold" } : { kind: "call" };
				try {
					setTable(applyAction(live, actor.seat, backup));
				} catch {}
			}
		}, wait);
		return () => window.clearTimeout(id);
	}, [table]);
	(0, import_react.useEffect)(() => {
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
			const action = legalActions(live, actor.seat).check ? { kind: "check" } : { kind: "fold" };
			try {
				if (saveRef.current.sound) playAction(action.kind);
				setTable(applyAction(live, actor.seat, action));
			} catch {}
		}, 1e3);
		return () => window.clearInterval(id);
	}, [table]);
	const sit = (0, import_react.useCallback)((stake, buyIn) => {
		unlockAudio();
		const current = saveRef.current;
		const amount = Math.round(buyIn);
		if (amount < stake.min || amount > Math.min(stake.max, current.bankroll)) return;
		const nextTable = buildTable(current.name, stake, amount, 5, 0);
		const hero = heroSeat(nextTable);
		write({
			...current,
			bankroll: current.bankroll - amount,
			session: {
				stakeId: stake.id,
				stack: hero.stack + hero.totalPut,
				button: nextTable.button,
				handNo: 0
			}
		});
		settled.current = 0;
		setStakeId(stake.id);
		setTable(nextTable);
		if (current.sound) playAction("deal");
	}, [write]);
	const leave = (0, import_react.useCallback)(() => {
		const live = tableRef.current;
		const current = saveRef.current;
		let back = 0;
		if (live) {
			const hero = heroSeat(live);
			back = live.phase === "betting" ? hero.stack + hero.totalPut : hero.stack;
		}
		write({
			...current,
			bankroll: current.bankroll + back,
			session: null
		});
		setTable(null);
		setStakeId(null);
	}, [write]);
	const act = (0, import_react.useCallback)((action) => {
		const live = tableRef.current;
		if (!live || live.phase !== "betting" || live.toAct == null) return;
		const actor = live.seats[live.toAct];
		if (!actor?.isHero) return;
		try {
			const next = applyAction(live, actor.seat, action);
			if (saveRef.current.sound) playAction(action.kind === "raise" ? "raise" : action.kind);
			setTable(next);
		} catch {}
	}, []);
	const nextHand = (0, import_react.useCallback)(() => {
		const live = tableRef.current;
		const current = saveRef.current;
		if (!live || live.phase !== "between" && live.phase !== "bust") return;
		if (heroSeat(live).stack <= 0) {
			setTable({
				...live,
				phase: "bust",
				toAct: null,
				banner: "Te quedaste sin fichas"
			});
			if (current.session) write({
				...current,
				session: {
					...current.session,
					stack: 0
				}
			});
			return;
		}
		const next = startHand(live, { advance: true });
		setTable(next);
		if (current.sound) playAction("deal");
	}, [write]);
	(0, import_react.useEffect)(() => {
		if (!table || table.phase !== "between") return;
		const id = window.setTimeout(() => nextHand(), 4800);
		return () => window.clearTimeout(id);
	}, [table, nextHand]);
	const rebuy = (0, import_react.useCallback)((amount) => {
		const live = tableRef.current;
		const current = saveRef.current;
		const stake = stakeId ? stakeById(stakeId) : void 0;
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
				handNo: Math.max(0, next.handNo - 1)
			}
		});
		settled.current = next.phase === "between" ? next.handNo : settled.current;
		setTable(next);
	}, [stakeId, write]);
	const reload = (0, import_react.useCallback)(() => {
		const current = saveRef.current;
		if (current.bankroll >= 500) return;
		write({
			...current,
			bankroll: current.bankroll + RELOAD
		});
	}, [write]);
	const setName = (0, import_react.useCallback)((name) => {
		write({
			...saveRef.current,
			name: name.slice(0, 16)
		});
	}, [write]);
	const toggleSound = (0, import_react.useCallback)(() => {
		unlockAudio();
		write({
			...saveRef.current,
			sound: !saveRef.current.sound
		});
	}, [write]);
	return {
		hydrated,
		save,
		table,
		stake: stakeId ? stakeById(stakeId) ?? null : null,
		clock,
		sit,
		leave,
		act,
		nextHand,
		rebuy,
		reload,
		setName,
		toggleSound
	};
}
function Room() {
	const room = useRoom();
	if (!room.hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "room grid min-h-dvh place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl text-gold",
			children: "RÍO"
		})
	});
	if (room.table && room.stake) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableView, {
		table: room.table,
		stake: room.stake,
		save: room.save,
		clock: room.clock,
		onAct: room.act,
		onLeave: room.leave,
		onNext: room.nextHand,
		onRebuy: room.rebuy,
		onToggleSound: room.toggleSound
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lobby, {
		save: room.save,
		onName: room.setName,
		onSit: room.sit,
		onReload: room.reload,
		onToggleSound: room.toggleSound
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Room, {});
}
//#endregion
export { Home as component };
