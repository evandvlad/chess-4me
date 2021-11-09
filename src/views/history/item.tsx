import React from "react";

import type { HistoryItem } from "~/domain";

import { cssClassNames } from "~/utils/css-class-names";
import { Content } from "./content";

import styles from "./history.module.scss";

interface Props {
	item: HistoryItem;
	index: number;
	isCurrent: boolean;
	select: (index: number) => void;
}

export function Item({ item, index, isCurrent, select }: Props) {
	function handleClick() {
		select(index);
	}

	const classNames = cssClassNames(styles.link, {
		[styles.current!]: isCurrent,
	});

	const num = index + 1;

	const dataAttributes: Record<`data-test-${string}`, string> = {
		"data-test-history-item": num.toString(),
	};

	if (isCurrent) {
		dataAttributes["data-test-history-item-current"] = "";
	}

	return (
		<span className={styles.item}>
			<button {...dataAttributes} type="button" className={classNames} onClick={handleClick}>
				<Content num={num} item={item} />
			</button>
		</span>
	);
}
