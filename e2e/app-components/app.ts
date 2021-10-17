import type { BoardCoordinate, Chessman, ChessmenArrangement } from "../app-values";
import type { AddChessmanDialog } from "./add-chessman-dialog";
import type { Board } from "./board";
import type { GameControls } from "./game-controls";

import { boardCoordinates, initialChessmenArrangement } from "../app-values";

interface Parameters {
	board: Board;
	gameControls: GameControls;
	addChessmanDialog: AddChessmanDialog;
}

export class App {
	readonly #board: Board;
	readonly #gameControls: GameControls;
	readonly #addChessmanDialog: AddChessmanDialog;

	constructor({ board, gameControls, addChessmanDialog }: Parameters) {
		this.#board = board;
		this.#gameControls = gameControls;
		this.#addChessmanDialog = addChessmanDialog;
	}

	moveChessman(chessman: Chessman, sourceCoordinate: BoardCoordinate, destinationCoordinate: BoardCoordinate): void {
		this.#board.assertChessman(chessman, sourceCoordinate);
		this.clearSelection();
		this.#board.selectCell(sourceCoordinate);
		this.#board.assertSelectedCell(sourceCoordinate);
		this.#board.selectCell(destinationCoordinate);
		this.#board.assertSelectedCell(null);
		this.#board.assertFocusedCell(destinationCoordinate);
		this.#board.assertChessman(chessman, destinationCoordinate);
	}

	addChessman(chessman: Chessman, coordinate: BoardCoordinate): void {
		this.#board.assertChessman(null, coordinate);
		this.clearSelection();
		this.#board.selectCell(coordinate);
		this.#gameControls.assertControlAvailability("add-chessman");
		this.#gameControls.performAction("add-chessman");
		this.#addChessmanDialog.assertVisibility();
		this.#addChessmanDialog.select(chessman);
		this.#addChessmanDialog.assertVisibility(false);
		this.#gameControls.assertControlAvailability("add-chessman", false);
		this.#board.assertChessman(chessman, coordinate);
		this.#board.assertSelectedCell(coordinate);
		this.#board.assertFocusedCell(coordinate);
	}

	removeChessman(chessman: Chessman, coordinate: BoardCoordinate): void {
		this.clearSelection();
		this.#board.assertChessman(chessman, coordinate);
		this.#board.selectCell(coordinate);
		this.#board.assertSelectedCell(coordinate);
		this.#gameControls.assertControlAvailability("remove-chessman");
		this.#gameControls.performAction("remove-chessman");
		this.#board.assertSelectedCell(coordinate);
		this.#board.assertFocusedCell(coordinate);
		this.#gameControls.assertControlAvailability("remove-chessman", false);
	}

	assertChessmenArrangement(chessmenArrangement: ChessmenArrangement): void {
		const chessmenMap = new Map(chessmenArrangement);

		boardCoordinates.forEach((coordinate) => {
			this.#board.assertChessman(chessmenMap.get(coordinate) ?? null, coordinate);
		});
	}

	newGame(): void {
		this.#gameControls.assertControlAvailability("new-game");
		this.#gameControls.performAction("new-game");

		this.assertChessmenArrangement(initialChessmenArrangement);
		this.#board.assertSelectedCell(null);
		this.#board.assertFocusedCell(null);

		this.#gameControls.assertControlAvailability("new-game", false);
	}

	goBack(): void {
		this.#gameControls.assertControlAvailability("go-back");
		this.#gameControls.performAction("go-back");
	}

	goForward(): void {
		this.#gameControls.assertControlAvailability("go-forward");
		this.#gameControls.performAction("go-forward");
	}

	flipBoard(): void {
		this.#gameControls.assertControlAvailability("flip-board");
		this.#gameControls.performAction("flip-board");
	}

	clearSelection(): void {
		this.#board.getSelectedCell().then(({ value }) => {
			if (value !== null) {
				this.#board.selectCell(value);
			}
		});
	}
}
