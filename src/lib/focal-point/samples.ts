export interface SampleGuide {
  x: number;
  y: number;
  zoomPercent: number;
}

export interface SampleImage {
  id: string;
  src: string;
  fileName: string;
  alt: string;
  label: string;
  guide: SampleGuide;
}

export const SAMPLE_IMAGES: readonly SampleImage[] = [
  {
    id: "staircase",
    src: "/samples/staircase.jpg",
    fileName: "staircase.jpg",
    alt: "Person sitting on a white staircase in front of a glass building",
    label: "Stairs",
    guide: { x: 40.3, y: 59.3, zoomPercent: 155 },
  },
  {
    id: "taxi",
    src: "/samples/taxi.jpg",
    fileName: "taxi.jpg",
    alt: "Red taxi at a yellow-marked street intersection",
    label: "Taxi",
    guide: { x: 13.6, y: 7.9, zoomPercent: 120 },
  },
  {
    id: "subway",
    src: "/samples/subway.jpg",
    fileName: "subway.jpg",
    alt: "Times Square subway station entrance seen from above",
    label: "Station",
    guide: { x: 50, y: 74.5, zoomPercent: 125 },
  },
  {
    id: "night",
    src: "/samples/night.jpg",
    fileName: "night.jpg",
    alt: "Person holding a phone at night across a river from a lit dome",
    label: "Night",
    guide: { x: 14.4, y: 47.7, zoomPercent: 110 },
  },
];
