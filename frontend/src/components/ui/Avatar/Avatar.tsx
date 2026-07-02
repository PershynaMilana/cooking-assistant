import { User } from "lucide-react";
import React from "react";

import styles from "./Avatar.module.scss";

interface AvatarProps {
    initials?: string;
    size?: number;
}

const DEFAULT_SIZE = 40;
const ICON_SCALE = 0.5;

export const Avatar: React.FC<AvatarProps> = ({
    initials,
    size = DEFAULT_SIZE,
}) => (
    <span className={styles.avatar} style={{ width: size, height: size }}>
        {initials ?? (
            <User size={Math.round(size * ICON_SCALE)} aria-hidden="true" />
        )}
    </span>
);
