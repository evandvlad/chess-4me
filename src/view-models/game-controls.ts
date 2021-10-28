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
	get canNewGame(): boolean {
		const { history } = this.#gameManagement.currentGame;
		return history.canGoBack;
	}

	@computed
	get canGoBack(): boolean {
		const { history } = this.#gameManagement.currentGame;
		return history.canGoBack;
	}

	@computed
	get canGoForward(): boolean {
		const { history } = this.#gameManagement.currentGame;
		return history.canGoForward;
	}

	@computed
	get canAddChessman(): boolean {
		const { board } = this.#gameManagement.currentGame;
		return this.#mainBoard.hasSelectedCell && !board.hasChessmanByCoordinate(this.#mainBoard.selectedCell!);
	}

	@computed
	get canRemoveChessman(): boolean {
		const { currentGame } = this.#gameManagement;
		return this.#mainBoard.hasSelectedCell && currentGame.canRemoveChessman(this.#mainBoard.selectedCell!);
	}

	getAvailableChessmenForAdding = (): ReadonlyArray<Chessman> => {
		const { currentGame } = this.#gameManagement;
		return currentGame.availableChessmenForAdding;
	};

	newGame = (): void => {
		assertTrue(this.canNewGame, "'New Game' action isn't allowed");
		this.#gameManagement.newGame();
		this.#mainBoard.clearSelection();
	};

	goBack = (): void => {
		assertTrue(this.canGoBack, "'Go Back' action isn't allowed");

		const { history } = this.#gameManagement.currentGame;
		history.goBack();
	};

	goForward = (): void => {
		assertTrue(this.canGoForward, "'Go Forward' action isn't allowed");

		const { history } = this.#gameManagement.currentGame;
		history.goForward();
	};

	addChessman = (chessman: Chessman): void => {
		assertTrue(this.canAddChessman, "'Add Chessman' action isn't allowed");

		const { currentGame } = this.#gameManagement;
		currentGame.addChessman(this.#mainBoard.selectedCell!, chessman);
	};

	removeChessman = (): void => {
		assertTrue(this.canRemoveChessman, "'Remove Chessman' action isn't allowed");

		const { currentGame } = this.#gameManagement;
		currentGame.removeChessman(this.#mainBoard.selectedCell!);
	};

	flipBoard = (): void => {
		this.#mainBoard.flip();
	};
}
