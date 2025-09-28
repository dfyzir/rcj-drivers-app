import React from "react";

type IconSvgProps = {
  size?: number;
  width?: number;
  height?: number;
} & React.SVGProps<SVGSVGElement>;

export const ChevronDownIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}>
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
