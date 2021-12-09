import React, { memo } from "react";
import { observer } from "mobx-react-lite";
import { type History as ViewModelHistory } from "~/view-models";
import { Item } from "./item";
import styles from "./history.module.scss";

interface Props {
	viewModel: ViewModelHistory;
}

const MemoItem = memo(Item);

export const History = observer(function HistoryObserver({ viewModel }: Props) {
	const content = viewModel.items
		.map((item) => <MemoItem key={item.index} {...item} select={viewModel.goByHistoryIndex} />)
		.reverse();

	return (
		<ol className={styles.list} reversed data-test-history="">
			{content}
		</ol>
	);
});
