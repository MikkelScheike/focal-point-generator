import type { ReactNode, SVGProps } from "react";

function Svg({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function UploadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M12 16V4m0 0 4 4m-4-4L8 8M4 20h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 15V6.2A2.2 2.2 0 0 1 7.2 4H15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M5 12.5 9.5 17 19 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ResetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M4.5 12a7.5 7.5 0 1 0 2.1-5.2M4.5 4.5v5h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M8.5 8 4 12l4.5 4M15.5 8 20 12l-4.5 4M13 6l-2 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function BackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M14 5 7 12l7 7M7 12h13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
