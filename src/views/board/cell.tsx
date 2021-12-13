import React from "react";
import { type BoardCoordinate } from "~/domain";
import { type Cell as ViewModelCell } from "~/view-models";
import { cssClassNames } from "~/utils/css-class-names";
import { Chessman } from "../chessman";
import styles from "./board.module.scss";

interface Props extends ViewModelCell {
	select: (coordinate: BoardCoordinate) => void;
}

export function Cell({ coordinate, isSelected, isFocused, chessman, select }: Props) {
	const className = cssClassNames(styles.cell, {
		[styles.selected!]: isSelected,
		[styles.focused!]: isFocused,
	});

	const dataAttributes: Record<`data-${string}`, string> = {
		"data-style-board-coordinate": coordinate,
		"data-test-board-cell": coordinate,
	};

	if (isSelected) {
		dataAttributes["data-test-board-selected-cell"] = "";
	}

	if (isFocused) {
		dataAttributes["data-test-board-focused-cell"] = "";
	}

	function handleClick() {
		select(coordinate);
	}

	return (
		<div {...dataAttributes} className={className} onClick={handleClick} title={coordinate} tabIndex={-1}>
			{chessman ? <Chessman chessman={chessman.value} isUnderAttack={chessman.isUnderAttack} /> : null}
		</div>
	);
}
