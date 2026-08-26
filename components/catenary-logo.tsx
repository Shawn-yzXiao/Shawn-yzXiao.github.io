import type { SVGProps } from "react";

export function CatenaryLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 128 128"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M22 18C30 40 44 52 64 60C84 52 98 40 106 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
      />
      <path
        d="M64 60V91"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <path
        d="M41 78C52 83 58 87 64 91C73 97 84 104 96 112"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5.5"
      />
      <path
        d="M91 78C80 84 72 88 64 91C56 97 46 104 35 112"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5.5"
      />
      <circle className="catenary-logo-joint" cx="64" cy="91" r="4" />
    </svg>
  );
}
