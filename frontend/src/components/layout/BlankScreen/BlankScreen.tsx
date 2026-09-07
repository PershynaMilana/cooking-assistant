import React from "react";

import styles from "./BlankScreen.module.scss";

// holds the viewport while the session is still undecided: showing a spinner here would flash on
// every navigation, and rendering nothing at all would collapse the page and shift the layout
export const BlankScreen: React.FC = () => (
    <div className={styles["blank-screen"]} />
);
