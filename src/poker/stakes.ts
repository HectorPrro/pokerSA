import type { Style } from "./engine";

export interface Stake {
  id: string;
  name: string;
  sb: number;
  bb: number;
  min: number;
  max: number;
  note: string;
}

export const STAKES: Stake[] = [
  {
    id: "baja",
    name: "Mesa Baja",
    sb: 1,
    bb: 2,
    min: 80,
    max: 400,
    note: "La mesa de entrada. Los errores salen baratos.",
  },
  {
    id: "media",
    name: "Mesa Media",
    sb: 5,
    bb: 10,
    min: 400,
    max: 2000,
    note: "Donde se sientan los regulares de la casa.",
  },
  {
    id: "alta",
    name: "Mesa Alta",
    sb: 25,
    bb: 50,
    min: 2000,
    max: 10000,
    note: "Stacks profundos. Cada calle pesa.",
  },
];

export const REGULARS: { name: string; style: Exclude<Style, "human">; tag: string }[] = [
  { name: "Nico", style: "nit", tag: "Cerrado" },
  { name: "Vera", style: "tag", tag: "Selectiva" },
  { name: "Mateo", style: "lag", tag: "Agresivo" },
  { name: "Lola", style: "station", tag: "Pega" },
  { name: "Hugo", style: "maniac", tag: "Suelto" },
];

export const STARTING_BANK = 10000;
export const RELOAD = 5000;
export const SAVE_KEY = "rio-holdem-v1";

export interface Save {
  version: 1;
  name: string;
  bankroll: number;
  sound: boolean;
  stats: { hands: number; won: number; best: number };
  session: null | { stakeId: string; stack: number; button: number; handNo: number };
}

export const DEFAULT_SAVE: Save = {
  version: 1,
  name: "Alex",
  bankroll: STARTING_BANK,
  sound: true,
  stats: { hands: 0, won: 0, best: 0 },
  session: null,
};

export function stakeById(id: string): Stake | undefined {
  return STAKES.find((s) => s.id === id);
}
