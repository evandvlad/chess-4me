import React from "react";
import { observer } from "mobx-react-lite";

import type { BoardCoordinate, Chessman as IChessman } from "~/domain";
import type { MainBoard } from "~/view-models";

import { cssClassNames } from "~/utils/dom";
import { Chessman } from "../chessman";

import styles from "./board.module.scss";

function Cell({
	coordinate,
	isSelected,
	isFocused,
	chessman,
	onClick,
}: {
	coordinate: BoardCoordinate;
	isSelected: boolean;
	isFocused: boolean;
	chessman: IChessman | null;
	onClick: (coordinate: BoardCoordinate) => void;
}): JSX.Element {
	const className = cssClassNames(styles.cell!, {
		[styles.selected!]: isSelected,
		[styles.focused!]: isFocused,
	});

	const dataAttributes: Record<string, string> = {
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
		onClick(coordinate);
	}

	return (
		<div {...dataAttributes} className={className} onClick={handleClick} title={coordinate}>
			{chessman ? <Chessman chessman={chessman} /> : null}
		</div>
	);
}

export const Board = observer(function Board({ mainBoard }: { mainBoard: MainBoard }): JSX.Element {
	const boardCells = mainBoard.coordinates.map((coordinate) => (
		<Cell
			key={coordinate}
			coordinate={coordinate}
			isSelected={mainBoard.isCellSelected(coordinate)}
			isFocused={mainBoard.isCellFocused(coordinate)}
			chessman={mainBoard.getChessmanByCoordinate(coordinate)}
			onClick={mainBoard.selectCell}
		/>
	));

	const className = cssClassNames(styles.board!, { [styles.flipped!]: mainBoard.isFlipped });

	return (
		<div className={className} data-test-board={mainBoard.isFlipped ? "flipped" : "regular"}>
			{boardCells}
		</div>
	);
});
