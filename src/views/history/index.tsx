import React from "react";
import { observer } from "mobx-react-lite";

import type { History as IHistory } from "~/view-models";

import { Item } from "./item";

import styles from "./history.module.scss";

export const History = observer(function History({ history }: { history: IHistory }): JSX.Element {
	const actions = history.items
		.map((item, index) => (
			<Item
				// eslint-disable-next-line react/no-array-index-key
				key={index}
				index={index}
				item={item}
				isCurrent={history.isCurrentHistoryIndex(index)}
				select={history.goByHistoryIndex}
			/>
		))
		.reverse();

	return (
		<div className={styles.list} data-test-history="">
			{actions}
		</div>
	);
});
