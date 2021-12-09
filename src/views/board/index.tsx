import React, { useMemo } from "react";
import { observer, Observer } from "mobx-react-lite";
import { type Board as ViewModelBoard } from "~/view-models";
import { cssClassNames } from "~/utils/css-class-names";
import { Cell } from "./cell";
import styles from "./board.module.scss";

export const Board = observer(function BoardObserver({ viewModel }: { viewModel: ViewModelBoard }) {
	const boardCells = useMemo(
		() =>
			viewModel.cells.map((cell) => (
				<Observer key={cell.coordinate}>
					{() => (
						<Cell
							coordinate={cell.coordinate}
							isFocused={cell.isFocused}
							isSelected={cell.isSelected}
							chessman={cell.chessman}
							select={viewModel.selectCell}
						/>
					)}
				</Observer>
			)),
		[viewModel.cells],
	);

	const className = cssClassNames(styles.board, { [styles.flipped!]: viewModel.isFlipped });

	return (
		<div className={className} data-test-board={viewModel.isFlipped ? "flipped" : "regular"}>
			{boardCells}
		</div>
	);
});
