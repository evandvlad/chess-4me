import React from "react";
import { observer, Observer } from "mobx-react-lite";

import type { ChessmenDiff as ViewModelChessmenDiff } from "~/view-models";

import { Group } from "./group";

import styles from "./chessmen-diff.module.scss";

interface Props {
	viewModel: ViewModelChessmenDiff;
}

export const ChessmenDiff = observer(function ChessmenDiffObserver({ viewModel }: Props) {
	const content = viewModel.groups.map((group) => (
		<Observer key={group}>{() => <Group items={viewModel.getDetailsByGroup(group)} />}</Observer>
	));

	return (
		<div className={styles.diff} data-test-chessmen-diff="">
			{content}
		</div>
	);
});
