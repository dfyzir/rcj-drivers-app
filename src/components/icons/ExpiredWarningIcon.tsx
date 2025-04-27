import React from "react";
import { IconSvgProps } from "../../lib/types";

export const ExpiredWarningIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox={`0 0 ${size} ${size}`}
    strokeWidth="1.5"
    stroke={props?.stroke ?? "red"}
    className={`w-8 h-8 ${props.className}`}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
    />
  </svg>
);
