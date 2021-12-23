import React, { useEffect, useMemo, useRef } from "react";
import { observer, Observer } from "mobx-react-lite";
import { type Board as ViewModelBoard } from "~/view-models";
import { cssClassNames } from "~/utils/css-class-names";
import { Cell } from "./cell";
import styles from "./board.module.scss";

export const Board = observer(function BoardObserver({ viewModel }: { viewModel: ViewModelBoard }) {
	const ref = useRef<HTMLDivElement>(null);

	function handleEscPress(e: KeyboardEvent) {
		if (e.key === "Escape" && ref.current?.contains(e.target as Node)) {
			viewModel.clearSelection();
		}
	}

	useEffect(() => {
		window.addEventListener("keyup", handleEscPress);

		return () => {
			window.removeEventListener("keyup", handleEscPress);
		};
	}, []);

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
		<div className={className} data-test-board={viewModel.isFlipped ? "flipped" : "regular"} ref={ref}>
			{boardCells}
		</div>
	);
});
