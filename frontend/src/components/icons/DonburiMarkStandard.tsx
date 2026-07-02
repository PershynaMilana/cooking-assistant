import React from "react";

import type { DonburiMarkProps } from "./DonburiMark.types";

const DEFAULT_SIZE = 32;

// Tier 4/5 - 32px - Donburi mark with chopsticks and single-bend steam, no
// foot yet.
export const DonburiMarkStandard: React.FC<DonburiMarkProps> = ({
    size = DEFAULT_SIZE,
    className,
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={className}
    >
        <path d="M11 12c-1.3-1.4 1.3-2.5 0-3.9" />
        <path d="M14.5 12c-1.3-1.4 1.3-2.5 0-3.9" />
        <path d="M13.5 15.5 27 9" />
        <path d="M14.3 17 27.8 10.5" />
        <path d="M5 15h22" />
        <path d="M5 15a11 11 0 0 0 22 0" />
    </svg>
);
