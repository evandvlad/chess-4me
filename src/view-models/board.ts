import { makeObservable, observable, action, computed } from "mobx";

import type { BoardCoordinate, Chessman } from "~/domain";
import type { GameManager } from "./game-manager";

import { boardCoordinates } from "~/domain";

export interface Cell {
	readonly coordinate: BoardCoordinate;
	readonly isFocused: boolean;
	readonly isSelected: boolean;
	readonly chessman: Chessman | undefined;
}

class BoardCell implements Cell {
	readonly coordinate: BoardCoordinate;

	readonly #gameManager: GameManager;
	readonly #board: Board;

	constructor(gameManager: GameManager, board: Board, coordinate: BoardCoordinate) {
		makeObservable(this);

		this.#gameManager = gameManager;
		this.#board = board;
		this.coordinate = coordinate;
	}

	@computed
	get isFocused() {
		const { activeCoordinate } = this.#gameManager.currentGame.boardState;
		return activeCoordinate === this.coordinate;
	}

	@computed
	get isSelected() {
		return this.#board.selectedCell === this.coordinate;
	}

	@computed
	get chessman() {
		const { chessmenMap } = this.#gameManager.currentGame.boardState;
		return chessmenMap.get(this.coordinate);
	}
}

export class Board {
	@observable selectedCell: BoardCoordinate | null = null;
	@observable isFlipped = false;

	readonly cells: ReadonlyArray<Cell>;
	readonly #gameManager: GameManager;

	constructor(gameManager: GameManager) {
		makeObservable(this);

		this.#gameManager = gameManager;

		this.cells = boardCoordinates.map((coordinate) => new BoardCell(this.#gameManager, this, coordinate));
	}

	@action
	flip() {
		this.isFlipped = !this.isFlipped;
	}

	@action
	clearSelection() {
		this.selectedCell = null;
	}

	@action
	selectCell = (coordinate: BoardCoordinate) => {
		const isSameCellSelected = this.selectedCell === coordinate;

		if (isSameCellSelected) {
			this.selectedCell = null;
			return;
		}

		const { currentGame } = this.#gameManager;
		const { chessmenMap } = currentGame.boardState;

		if (!this.selectedCell || !chessmenMap.has(this.selectedCell)) {
			this.selectedCell = coordinate;
			return;
		}

		const chessman = chessmenMap.get(this.selectedCell);
		const canMoveChessman = chessman && currentGame.canMoveChessman(chessman, this.selectedCell, coordinate);

		if (!canMoveChessman) {
			return;
		}

		currentGame.moveChessman(chessman, this.selectedCell, coordinate);

		this.selectedCell = null;
	};
}
