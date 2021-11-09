import React from "react";

import type { HistoryItem } from "~/domain";

import { Chessman } from "../chessman";

import styles from "./history.module.scss";

interface Props {
	num: number;
	item: HistoryItem;
}

function renderContent({ item, prefix, suffix }: { item: HistoryItem; prefix: string; suffix: string }) {
	return (
		<span className={styles.content} data-test-history-item-content={`${item.action}:${item.chessman}:${suffix}`}>
			{prefix}
			<Chessman className={styles.chessman} chessman={item.chessman} />
			{suffix}
		</span>
	);
}

export function Content({ num, item }: Props) {
	const numPrefix = `${num}. `;

	switch (item.action) {
		case "adding":
			return renderContent({
				item,
				prefix: `${numPrefix}[+]`,
				suffix: item.coordinate,
			});

		case "removing":
			return renderContent({
				item,
				prefix: `${numPrefix}[-]`,
				suffix: item.coordinate,
			});

		case "moving":
			return renderContent({
				item,
				prefix: numPrefix,
				suffix: `${item.sourceCoordinate}${item.isCapture ? "x" : "-"}${item.destinationCoordinate}`,
			});

		default:
			throw new Error("Unknown item action type");
	}
}
