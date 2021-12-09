import { makeObservable, computed } from "mobx";
import { type GameManager } from "./game-manager";
import { type Board } from "./board";
import { type Chessman } from "~/domain";
import { assert } from "~/utils/assert";

export class Controls {
	#gameManager: GameManager;
	#board: Board;

	constructor(gameManager: GameManager, board: Board) {
		makeObservable(this);

		this.#gameManager = gameManager;
		this.#board = board;
	}

	@computed
	get isGoBackActionAvailable() {
		const { history } = this.#gameManager.currentGame;
		return history.canGoBack;
	}

	@computed
	get isGoForwardActionAvailable() {
		const { history } = this.#gameManager.currentGame;
		return history.canGoForward;
	}

	@computed
	get isAddChessmanActionAvailable() {
		const { chessmenMap } = this.#gameManager.currentGame.boardState;
		return this.#board.selectedCell !== null && !chessmenMap.has(this.#board.selectedCell);
	}

	@computed
	get isRemoveChessmanActionAvailable() {
		const { currentGame } = this.#gameManager;
		const { selectedCell } = this.#board;

		if (!selectedCell) {
			return false;
		}

		const { chessmenMap } = currentGame.boardState;
		const chessman = chessmenMap.get(selectedCell);

		if (!chessman) {
			return false;
		}

		return currentGame.canRemoveChessman(chessman, selectedCell);
	}

	getAvailableChessmenForAdding = (): ReadonlyArray<Chessman> => {
		const { currentGame } = this.#gameManager;
		return currentGame.availableChessmenForAdding;
	};

	emptyBoard = () => {
		this.#gameManager.newGameOnEmptyBoardMode();
		this.#board.clearSelection();
	};

	newGame = () => {
		this.#gameManager.newGameOnRegularMode();
		this.#board.clearSelection();
	};

	goBack = () => {
		assert(this.isGoBackActionAvailable, "'Go Back' action isn't available");

		const { history } = this.#gameManager.currentGame;
		history.goBack();
	};

	goForward = () => {
		assert(this.isGoForwardActionAvailable, "'Go Forward' action isn't available");

		const { history } = this.#gameManager.currentGame;
		history.goForward();
	};

	addChessman = (chessman: Chessman) => {
		assert(this.isAddChessmanActionAvailable, "'Add Chessman' action isn't available");

		const { currentGame } = this.#gameManager;
		currentGame.addChessman(chessman, this.#board.selectedCell!);
		this.#board.clearSelection();
	};

	removeChessman = () => {
		assert(this.isRemoveChessmanActionAvailable, "'Remove Chessman' action isn't available");

		const { currentGame } = this.#gameManager;
		const selectedCell = this.#board.selectedCell!;
		const chessman = currentGame.boardState.chessmenMap.get(selectedCell)!;

		currentGame.removeChessman(chessman, selectedCell);
		this.#board.clearSelection();
	};

	flipBoard = () => {
		this.#board.flip();
	};
}
