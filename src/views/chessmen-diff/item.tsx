import React from "react";

import type { ChessmenDiffItem } from "~/domain";

import { Chessman } from "../chessman";

import styles from "./chessmen-diff.module.scss";

export function Item({ chessman, num }: ChessmenDiffItem) {
	return (
		<span className={styles.item} data-test-chessmen-diff-item={`${chessman}:${num}`}>
			<Chessman chessman={chessman} className={styles.chessman} />
			{num > 1 && <span className={styles.itemNum}>{num}</span>}
		</span>
	);
}
