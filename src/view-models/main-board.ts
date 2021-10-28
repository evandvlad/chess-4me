import { makeObservable, observable, action, computed } from "mobx";

import type { BoardCoordinate, Chessman } from "~/domain";
import type { GameManagement } from "./game-management";

import { boardCoordinates } from "~/domain";

export class MainBoard {
	@observable selectedCell: BoardCoordinate | null = null;
	@observable isFlipped = false;

	readonly coordinates = boardCoordinates;

	readonly #gameManagement: GameManagement;

	constructor(gameManagement: GameManagement) {
		makeObservable(this);

		this.#gameManagement = gameManagement;
	}

	@computed
	get focusedCell(): BoardCoordinate | null {
		const { currentGame } = this.#gameManagement;
		return currentGame.board.activeCoordinate;
	}

	getChessmanByCoordinate(coordinate: BoardCoordinate): Chessman | null {
		return this.#gameManagement.currentGame.board.getChessmanByCoordinate(coordinate);
	}

	get hasSelectedCell(): boolean {
		return this.selectedCell !== null;
	}

	isCellSelected(coordinate: BoardCoordinate): boolean {
		return this.selectedCell === coordinate;
	}

	isCellFocused(coordinate: BoardCoordinate): boolean {
		return this.focusedCell === coordinate;
	}

	@action
	selectCell = (coordinate: BoardCoordinate): void => {
		const isSameCellSelected = this.selectedCell && this.isCellSelected(coordinate);

		if (isSameCellSelected) {
			this.selectedCell = null;
			return;
		}

		const { currentGame } = this.#gameManagement;

		if (!this.selectedCell || !currentGame.board.hasChessmanByCoordinate(this.selectedCell)) {
			this.selectedCell = coordinate;
			return;
		}

		if (!currentGame.canMoveChessman(this.selectedCell, coordinate)) {
			return;
		}

		currentGame.moveChessman(this.selectedCell, coordinate);

		this.selectedCell = null;
	};

	@action
	flip(): void {
		this.isFlipped = !this.isFlipped;
	}

	@action
	clearSelection(): void {
		this.selectedCell = null;
	}
}
