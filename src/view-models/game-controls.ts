import { makeObservable, computed } from "mobx";

import type { GameManagement } from "./game-management";
import type { MainBoard } from "./main-board";
import type { Chessman } from "~/domain";

import { assertTrue } from "~/utils/assert";

interface Params {
	gameManagement: GameManagement;
	mainBoard: MainBoard;
}

export class GameControls {
	#gameManagement: GameManagement;
	#mainBoard: MainBoard;

	constructor({ gameManagement, mainBoard }: Params) {
		makeObservable(this);

		this.#gameManagement = gameManagement;
		this.#mainBoard = mainBoard;
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
		return this.#mainBoard.hasSelectedCell && !board.hasChessmanByCoordinate(this.#mainBoard.selectedCell!);
	}

	@computed
	get isRemoveChessmanActionAvailable(): boolean {
		const { currentGame } = this.#gameManagement;
		return this.#mainBoard.hasSelectedCell && currentGame.canRemoveChessman(this.#mainBoard.selectedCell!);
	}

	getAvailableChessmenForAdding = (): ReadonlyArray<Chessman> => {
		const { currentGame } = this.#gameManagement;
		return currentGame.availableChessmenForAdding;
	};

	emptyBoard = (): void => {
		this.#gameManagement.newGameOnEmptyBoardMode();
		this.#mainBoard.clearSelection();
	};

	newGame = (): void => {
		this.#gameManagement.newGameOnRegularMode();
		this.#mainBoard.clearSelection();
	};

	goBack = (): void => {
		assertTrue(this.isGoBackActionAvailable, "'Go Back' action isn't available");

		const { history } = this.#gameManagement.currentGame;
		history.goBack();
	};

	goForward = (): void => {
		assertTrue(this.isGoForwardActionAvailable, "'Go Forward' action isn't available");

		const { history } = this.#gameManagement.currentGame;
		history.goForward();
	};

	addChessman = (chessman: Chessman): void => {
		assertTrue(this.isAddChessmanActionAvailable, "'Add Chessman' action isn't available");

		const { currentGame } = this.#gameManagement;
		currentGame.addChessman(this.#mainBoard.selectedCell!, chessman);
		this.#mainBoard.clearSelection();
	};

	removeChessman = (): void => {
		assertTrue(this.isRemoveChessmanActionAvailable, "'Remove Chessman' action isn't available");

		const { currentGame } = this.#gameManagement;
		currentGame.removeChessman(this.#mainBoard.selectedCell!);
		this.#mainBoard.clearSelection();
	};

	flipBoard = (): void => {
		this.#mainBoard.flip();
	};
}
