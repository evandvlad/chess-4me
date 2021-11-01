import type { BoardCoordinate, Chessman, ChessmenArrangement, HistoryItemValue } from "../app-values";
import type { AddChessmanDialog } from "./add-chessman-dialog";
import type { Board } from "./board";
import type { Controls } from "./controls";
import type { History } from "./history";

import { boardCoordinates, initialChessmenArrangement } from "../app-values";

interface Parameters {
	board: Board;
	controls: Controls;
	addChessmanDialog: AddChessmanDialog;
	history: History;
}

export class App {
	readonly #board: Board;
	readonly #controls: Controls;
	readonly #addChessmanDialog: AddChessmanDialog;
	readonly #history: History;

	constructor({ board, controls, addChessmanDialog, history }: Parameters) {
		this.#board = board;
		this.#controls = controls;
		this.#addChessmanDialog = addChessmanDialog;
		this.#history = history;
	}

	moveChessman(chessman: Chessman, sourceCoordinate: BoardCoordinate, destinationCoordinate: BoardCoordinate): void {
		this.#board.assertChessman(chessman, sourceCoordinate);
		this.#board.selectCell(sourceCoordinate);
		this.#board.assertSelectedCell(sourceCoordinate);
		this.#board.selectCell(destinationCoordinate);
		this.#board.assertSelectedCell(null);
		this.#board.assertFocusedCell(destinationCoordinate);
		this.#board.assertChessman(chessman, destinationCoordinate);
	}

	addChessman(chessman: Chessman, coordinate: BoardCoordinate): void {
		this.#board.assertChessman(null, coordinate);
		this.#board.selectCell(coordinate);
		this.#controls.assertControlAvailability("add-chessman");
		this.#controls.performAction("add-chessman");
		this.#addChessmanDialog.assertVisibility();
		this.#addChessmanDialog.select(chessman);
		this.#addChessmanDialog.assertVisibility(false);
		this.#controls.assertControlAvailability("add-chessman", false);
		this.#board.assertChessman(chessman, coordinate);
		this.#board.assertSelectedCell(null);
		this.#board.assertFocusedCell(coordinate);
	}

	removeChessman(chessman: Chessman, coordinate: BoardCoordinate): void {
		this.#board.assertChessman(chessman, coordinate);
		this.#board.selectCell(coordinate);
		this.#board.assertSelectedCell(coordinate);
		this.#controls.assertControlAvailability("remove-chessman");
		this.#controls.performAction("remove-chessman");
		this.#board.assertSelectedCell(null);
		this.#board.assertFocusedCell(coordinate);
		this.#controls.assertControlAvailability("remove-chessman", false);
	}

	assertChessmenArrangement(chessmenArrangement: ChessmenArrangement): void {
		const chessmenMap = new Map(chessmenArrangement);

		boardCoordinates.forEach((coordinate) => {
			this.#board.assertChessman(chessmenMap.get(coordinate) ?? null, coordinate);
		});
	}

	newGameOnRegularMode(): void {
		this.#controls.performAction("new-game");

		this.assertChessmenArrangement(initialChessmenArrangement);
		this.#board.assertSelectedCell(null);
		this.#board.assertFocusedCell(null);

		this.#history.assertItems([]);
	}

	newGameOnEmptyBoardMode(): void {
		this.#controls.performAction("empty-board");

		this.assertChessmenArrangement([]);
		this.#board.assertSelectedCell(null);
		this.#board.assertFocusedCell(null);

		this.#history.assertItems([]);
	}

	goBack(): void {
		this.#controls.assertControlAvailability("go-back");
		this.#controls.performAction("go-back");
	}

	goForward(): void {
		this.#controls.performAction("go-forward");
	}

	goByHistoryNumber(num: number): void {
		this.#history.selectByNumber(num);
		this.#history.assertCurrentItemNumber(num);
	}

	flipBoard(): void {
		this.#controls.assertControlAvailability("flip-board");
		this.#controls.performAction("flip-board");
	}

	assertHistory(values: HistoryItemValue[], currentItem: number | undefined) {
		const valuesLength = values.length;

		const historyItems = values.map((value, index) => {
			const num = valuesLength - index;

			return {
				num,
				value,
				isCurrent: num === currentItem,
			};
		});

		this.#history.assertItems(historyItems);
	}
}
