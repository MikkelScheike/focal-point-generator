export type DemoLayoutKind = "split" | "hero" | "card";

export interface DemoLayout {
  id: string;
  label: string;
  shortLabel: string;
  kind: DemoLayoutKind;
  ratio: number;
}

export const DEMO_LAYOUTS: readonly DemoLayout[] = [
  {
    id: "login",
    label: "Split login",
    shortLabel: "Split",
    kind: "split",
    ratio: 1,
  },
  {
    id: "hero",
    label: "Wide hero",
    shortLabel: "Hero",
    kind: "hero",
    ratio: 16 / 9,
  },
  {
    id: "card",
    label: "Mobile card",
    shortLabel: "Card",
    kind: "card",
    ratio: 4 / 5,
  },
];

export const DEMO_TRANSITION_MS = 700;
