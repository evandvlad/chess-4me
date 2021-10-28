import { action, makeObservable, observable, computed } from "mobx";

import type { BoardCoordinate, Chessman } from "../chess-setup";
import type { BoardClientAPI } from "./board";
import type { HistoryClientAPI } from "./history";
import type { ChessmenMap } from "./chessmen";

import { chessmenRegistry, areChessmenEquals, initialChessmenMap } from "./chessmen";
import { assertTrue } from "~/utils/assert";
import { Board } from "./board";
import { History } from "./history";

export class Game {
	@observable.ref private _board: Board;
	#history: History;

	static createOnRegularMode() {
		return new this(initialChessmenMap);
	}

	static createOnEmptyBoardMode() {
		return new this(new Map());
	}

	private constructor(chessmenMap: ChessmenMap) {
		makeObservable(this);

		this._board = Board.createNew(chessmenMap);

		this.#history = new History({
			initialRecord: {
				activeCoordinate: this._board.activeCoordinate,
				chessmenMap: this._board.chessmenMap,
			},
			onChanged: this.#handleHistoryChanged,
		});
	}

	@computed
	get board(): BoardClientAPI {
		return this._board;
	}

	get history(): HistoryClientAPI {
		return this.#history;
	}

	get availableChessmenForAdding(): ReadonlyArray<Chessman> {
		return [
			chessmenRegistry.get("white", "queen"),
			chessmenRegistry.get("black", "queen"),
			chessmenRegistry.get("white", "rook"),
			chessmenRegistry.get("black", "rook"),
			chessmenRegistry.get("white", "knight"),
			chessmenRegistry.get("black", "knight"),
			chessmenRegistry.get("white", "bishop"),
			chessmenRegistry.get("black", "bishop"),
			chessmenRegistry.get("white", "pawn"),
			chessmenRegistry.get("black", "pawn"),
			chessmenRegistry.get("white", "king"),
			chessmenRegistry.get("black", "king"),
		].filter((chessman) => {
			switch (chessman.type) {
				case "pawn":
					return this._board.getChessmanCount(chessman) < 8;

				case "king":
					return this._board.getChessmanCount(chessman) === 0;

				default:
					return true;
			}
		});
	}

	canMoveChessman(sourceCoordinate: BoardCoordinate, destinationCoordinate: BoardCoordinate): boolean {
		const sourceChessman = this._board.getChessmanByCoordinate(sourceCoordinate);

		if (!sourceChessman) {
			return false;
		}

		const destinationChessman = this._board.getChessmanByCoordinate(destinationCoordinate);

		if (!destinationChessman) {
			return true;
		}

		if (sourceChessman.color === destinationChessman.color) {
			return false;
		}

		if (destinationChessman.type === "king") {
			return false;
		}

		return true;
	}

	canRemoveChessman(coordinate: BoardCoordinate): boolean {
		const chessman = this._board.getChessmanByCoordinate(coordinate);

		if (!chessman) {
			return false;
		}

		if (chessman.type === "king") {
			return false;
		}

		return true;
	}

	@action
	addChessman(coordinate: BoardCoordinate, chessman: Chessman): void {
		assertTrue(this.#canAddChessman(coordinate, chessman), "Incorrect invariant for adding");
		this._board = this._board.addChessman(coordinate, chessman);
		this.#addHistoryRecord();
	}

	@action
	moveChessman(sourceCoordinate: BoardCoordinate, destinationCoordinate: BoardCoordinate): void {
		assertTrue(this.canMoveChessman(sourceCoordinate, destinationCoordinate), "Incorrect invariant for moving");
		this._board = this._board.moveChessman(sourceCoordinate, destinationCoordinate);
		this.#addHistoryRecord();
	}

	@action
	removeChessman(coordinate: BoardCoordinate): void {
		assertTrue(this.canRemoveChessman(coordinate), "Incorrect invariant for removing");
		this._board = this._board.removeChessman(coordinate);
		this.#addHistoryRecord();
	}

	#canAddChessman(coordinate: BoardCoordinate, chessman: Chessman): boolean {
		if (this._board.hasChessmanByCoordinate(coordinate)) {
			return false;
		}

		return this.availableChessmenForAdding.some((availableChessman) =>
			areChessmenEquals(availableChessman, chessman),
		);
	}

	#addHistoryRecord(): void {
		this.#history.addRecord({
			activeCoordinate: this._board.activeCoordinate,
			chessmenMap: this._board.chessmenMap,
		});
	}

	#handleHistoryChanged = (): void => {
		const { currentRecord } = this.#history;
		this._board = Board.createFromHistoryRecord(currentRecord);
	};
}