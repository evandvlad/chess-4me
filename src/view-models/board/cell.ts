import { makeObservable, computed, comparer } from "mobx";

import type { BoardCoordinate, Chessman as DomainChessman } from "~/domain";
import type { GameManager } from "../game-manager";
import type { Board } from "./board";

interface Chessman {
	readonly value: DomainChessman;
	readonly isUnderAttack: boolean;
}

export interface Cell {
	readonly coordinate: BoardCoordinate;
	readonly isFocused: boolean;
	readonly isSelected: boolean;
	readonly chessman: Chessman | undefined;
}

export class BoardCell implements Cell {
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

	@computed({ equals: comparer.shallow })
	get chessman() {
		const { boardState } = this.#gameManager.currentGame;

		if (!boardState.chessmenMap.has(this.coordinate)) {
			return;
		}

		const value = boardState.chessmenMap.get(this.coordinate)!;

		return { value, isUnderAttack: boardState.chessmanUnderCheck === value };
	}
}
