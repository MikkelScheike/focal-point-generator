export type DemoLayoutKind = "split" | "hero" | "card";

export interface DemoLayout {
  id: string;
  label: string;
  kind: DemoLayoutKind;
  ratio: number;
}

export const DEMO_LAYOUTS: readonly DemoLayout[] = [
  { id: "login", label: "Split login", kind: "split", ratio: 1 },
  { id: "hero", label: "Wide hero", kind: "hero", ratio: 16 / 9 },
  { id: "card", label: "Mobile card", kind: "card", ratio: 4 / 5 },
];

export const DEMO_TRANSITION_MS = 700;
