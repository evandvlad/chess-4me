import React from "react";

import type { HistoryItem } from "~/domain";

import { Chessman } from "../chessman";

import styles from "./history.module.scss";

function renderContent({ item, prefix, suffix }: { item: HistoryItem; prefix?: string; suffix: string }) {
	const { action, chessman } = item;

	return (
		<span className={styles.content} data-test-history-item-content={`${action}:${chessman}:${suffix}`}>
			{prefix}
			<Chessman className={styles.chessman} chessman={chessman} />
			{suffix}
		</span>
	);
}

export function Content(props: HistoryItem) {
	switch (props.action) {
		case "adding":
			return renderContent({
				item: props,
				prefix: "[+]",
				suffix: props.coordinate,
			});

		case "removing":
			return renderContent({
				item: props,
				prefix: "[-]",
				suffix: props.coordinate,
			});

		case "moving":
			return renderContent({
				item: props,
				suffix: `${props.sourceCoordinate}${props.isCapture ? "x" : "-"}${props.destinationCoordinate}`,
			});
	}
}
