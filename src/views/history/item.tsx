import React, { memo } from "react";
import { type HistoryItem } from "~/view-models";
import { cssClassNames } from "~/utils/css-class-names";
import { Content } from "./content";
import styles from "./history.module.scss";

interface Props extends HistoryItem {
	select: (index: number) => void;
}

const MemoContent = memo(Content);

export function Item({ index, isCurrent, data, select }: Props) {
	function handleClick() {
		select(index);
	}

	const classNames = cssClassNames(styles.item, {
		[styles.current!]: isCurrent,
	});

	const dataAttributes: Record<`data-test-${string}`, string> = {
		"data-test-history-item": String(index),
	};

	if (isCurrent) {
		dataAttributes["data-test-history-item-current"] = "";
	}

	return (
		<li className={styles.itemWrapper}>
			<button type="button" className={classNames} {...dataAttributes} onClick={handleClick}>
				<MemoContent {...data} />
			</button>
		</li>
	);
}
