import React, { memo } from "react";

import type { ChessmenDiffItem } from "~/domain";

import { Item } from "./item";

import styles from "./chessmen-diff.module.scss";

interface Props {
	items: ReadonlyArray<ChessmenDiffItem>;
}

const MemoItem = memo(Item);

export function Group({ items }: Props) {
	const content = items.map((item) => <MemoItem key={item.chessman} {...item} />);
	return <div className={styles.group}>{content}</div>;
}
