import { makeObservable, observable, action } from "mobx";

import type { BoardCoordinate } from "~/domain";
import type { GameManager } from "../game-manager";

import { boardCoordinates } from "~/domain";
import { BoardCell } from "./cell";

export class Board {
	@observable selectedCell: BoardCoordinate | null = null;
	@observable isFlipped = false;

	readonly cells: ReadonlyArray<BoardCell>;
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
