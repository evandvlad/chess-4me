import type { BoardCoordinate, Chessman } from "../app-values";

import type { AddChessmanDialog } from "./add-chessman-dialog";
import type { Board } from "./board";
import type { Controls } from "./controls";

interface Parameters {
	board: Board;
	controls: Controls;
	addChessmanDialog: AddChessmanDialog;
}

export class Game {
	readonly #board: Board;
	readonly #controls: Controls;
	readonly #addChessmanDialog: AddChessmanDialog;

	constructor({ board, controls, addChessmanDialog }: Parameters) {
		this.#board = board;
		this.#controls = controls;
		this.#addChessmanDialog = addChessmanDialog;
	}

	moveChessman(_: Chessman, sourceCoordinate: BoardCoordinate, destinationCoordinate: BoardCoordinate) {
		this.#board.selectCell(sourceCoordinate);
		this.#board.selectCell(destinationCoordinate);
	}

	addChessman(chessman: Chessman, coordinate: BoardCoordinate) {
		this.#board.selectCell(coordinate);
		this.#controls.performAction("add-chessman");
		this.#addChessmanDialog.select(chessman);
	}

	removeChessman(_: Chessman, coordinate: BoardCoordinate) {
		this.#board.selectCell(coordinate);
		this.#controls.performAction("remove-chessman");
	}
}
