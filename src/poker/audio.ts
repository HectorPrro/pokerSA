let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function unlockAudio() {
  const audio = context();
  if (audio && audio.state === "suspended") void audio.resume();
}

export function resumeAudio() {
  const audio = context();
  if (audio && audio.state === "suspended") void audio.resume();
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, when = 0) {
  const audio = context();
  if (!audio) return;
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const start = audio.currentTime + when;
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(amp);
  amp.connect(audio.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

export function playAction(kind: "fold" | "check" | "call" | "raise" | "win" | "deal") {
  if (kind === "deal") tone(740, 0.07, "triangle", 0.04);
  else if (kind === "check") tone(420, 0.06, "sine", 0.035);
  else if (kind === "fold") tone(196, 0.12, "sine", 0.04);
  else if (kind === "call") {
    tone(310, 0.07, "triangle", 0.05);
    tone(180, 0.09, "sine", 0.03);
  } else if (kind === "raise") {
    tone(520, 0.08, "triangle", 0.05);
    tone(260, 0.1, "sine", 0.035, 0.03);
  } else {
    tone(523, 0.12, "triangle", 0.05);
    tone(659, 0.14, "triangle", 0.045, 0.08);
    tone(784, 0.18, "sine", 0.04, 0.16);
  }
}
