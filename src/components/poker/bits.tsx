import { cardLabel, chips, isRed, rankChar, type Card, type Suit } from "@/poker/cards";

export function SuitMark({ suit, className }: { suit: Suit; className?: string }) {
  const props = { viewBox: "0 0 20 20", className, "aria-hidden": true as const };
  if (suit === "h") {
    return (
      <svg {...props}>
        <path
          fill="currentColor"
          d="M10 17s-6.2-3.9-6.2-8.2C3.8 6.2 5.7 4.6 7.6 4.6c1.2 0 2 .6 2.4 1.4.4-.8 1.2-1.4 2.4-1.4 1.9 0 3.8 1.6 3.8 4.2C16.2 13.1 10 17 10 17z"
        />
      </svg>
    );
  }
  if (suit === "d") {
    return (
      <svg {...props}>
        <path fill="currentColor" d="M10 2.2 16.2 10 10 17.8 3.8 10 10 2.2z" />
      </svg>
    );
  }
  if (suit === "c") {
    return (
      <svg {...props}>
        <path
          fill="currentColor"
          d="M10 3.2a2.7 2.7 0 0 1 1.2 5.1 2.6 2.6 0 1 1-2.4 4.2V16h2.4v1.4H8.8V12.5a2.6 2.6 0 1 1-2.4-4.2A2.7 2.7 0 0 1 10 3.2z"
        />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path
        fill="currentColor"
        d="M10 2c2.2 2.6 4.8 3.6 4.8 6.3 0 1.6-1 2.6-2.2 3 1 .3 2.4 1.2 2.4 2.8 0 2-1.8 3.4-4 3.4-.4 0-.7 0-1-.1V17h2.2V18.4H7.8V17H10v-.6c-.3.1-.6.1-1 .1-2.2 0-4-1.4-4-3.4 0-1.6 1.4-2.5 2.4-2.8-1.2-.4-2.2-1.4-2.2-3C5.2 5.6 7.8 4.6 10 2z"
      />
    </svg>
  );
}

export function PlayingCard({
  card,
  down = false,
  large = false,
  small = false,
}: {
  card?: Card | null;
  down?: boolean;
  large?: boolean;
  small?: boolean;
}) {
  const size = large ? "card card-lg" : small ? "card card-sm" : "card";
  if (down || !card) {
    return <div className={`${size} card-back`} aria-hidden="true" />;
  }
  return (
    <div className={`${size} ${isRed(card.s) ? "card-red" : ""}`} role="img" aria-label={cardLabel(card)}>
      <span className="card-corner">
        <span>{rankChar(card.r)}</span>
        <SuitMark suit={card.s} />
      </span>
      <span className="card-center">
        <SuitMark suit={card.s} />
      </span>
      <span className="card-corner card-corner-br">
        <span>{rankChar(card.r)}</span>
        <SuitMark suit={card.s} />
      </span>
    </div>
  );
}

export function Chip({ amount }: { amount: number }) {
  const tone =
    amount >= 1000 ? "gold" : amount >= 500 ? "purple" : amount >= 100 ? "black" : amount >= 25 ? "green" : amount >= 5 ? "red" : "white";
  return <span className={`chip chip-${tone} tabular-nums`}>{chips(amount)}</span>;
}
