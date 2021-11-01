import { makeObservable, computed } from "mobx";

import type { GameManagement } from "./game-management";
import type { Board } from "./board";
import type { Chessman } from "~/domain";

import { assert } from "~/utils/assert";

export class Controls {
	#gameManagement: GameManagement;
	#board: Board;

	constructor(gameManagement: GameManagement, board: Board) {
		makeObservable(this);

		this.#gameManagement = gameManagement;
		this.#board = board;
	}

	@computed
	get isGoBackActionAvailable(): boolean {
		const { history } = this.#gameManagement.currentGame;
		return history.canGoBack;
	}

	@computed
	get isGoForwardActionAvailable(): boolean {
		const { history } = this.#gameManagement.currentGame;
		return history.canGoForward;
	}

	@computed
	get isAddChessmanActionAvailable(): boolean {
		const { board } = this.#gameManagement.currentGame;
		return this.#board.hasSelectedCell && !board.hasChessmanByCoordinate(this.#board.selectedCell!);
	}

	@computed
	get isRemoveChessmanActionAvailable(): boolean {
		const { currentGame } = this.#gameManagement;
		return this.#board.hasSelectedCell && currentGame.canRemoveChessman(this.#board.selectedCell!);
	}

	getAvailableChessmenForAdding = (): ReadonlyArray<Chessman> => {
		const { currentGame } = this.#gameManagement;
		return currentGame.availableChessmenForAdding;
	};

	emptyBoard = (): void => {
		this.#gameManagement.newGameOnEmptyBoardMode();
		this.#board.clearSelection();
	};

	newGame = (): void => {
		this.#gameManagement.newGameOnRegularMode();
		this.#board.clearSelection();
	};

	goBack = (): void => {
		assert(this.isGoBackActionAvailable, "'Go Back' action isn't available");

		const { history } = this.#gameManagement.currentGame;
		history.goBack();
	};

	goForward = (): void => {
		assert(this.isGoForwardActionAvailable, "'Go Forward' action isn't available");

		const { history } = this.#gameManagement.currentGame;
		history.goForward();
	};

	addChessman = (chessman: Chessman): void => {
		assert(this.isAddChessmanActionAvailable, "'Add Chessman' action isn't available");

		const { currentGame } = this.#gameManagement;
		currentGame.addChessman(this.#board.selectedCell!, chessman);
		this.#board.clearSelection();
	};

	removeChessman = (): void => {
		assert(this.isRemoveChessmanActionAvailable, "'Remove Chessman' action isn't available");

		const { currentGame } = this.#gameManagement;
		currentGame.removeChessman(this.#board.selectedCell!);
		this.#board.clearSelection();
	};

	flipBoard = (): void => {
		this.#board.flip();
	};
}
