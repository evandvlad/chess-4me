import { action, makeObservable, observable, computed } from "mobx";

import type { BoardCoordinate, Chessman } from "../chess-setup";
import type { BoardClientAPI, HistoryClientAPI, ChessmenMap } from "./values";

import { getChessmanInfo, chessmenArrangement } from "../chess-setup";
import { assert } from "~/utils/assert";
import { Board } from "./board";
import { History } from "./history";

export type { HistoryItem } from "./values";

export class Game {
	@observable.ref private _board: Board;
	#history: History;

	static createOnRegularMode() {
		return new this(new Map(chessmenArrangement));
	}

	static createOnEmptyBoardMode() {
		return new this(new Map());
	}

	private constructor(chessmenMap: ChessmenMap) {
		makeObservable(this);

		this._board = Board.createNew(chessmenMap);

		this.#history = new History({
			boardState: this._board.state,
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
		return (
			[
				"white-queen",
				"black-queen",
				"white-rook",
				"black-rook",
				"white-knight",
				"black-knight",
				"white-bishop",
				"black-bishop",
				"white-pawn",
				"black-pawn",
				"white-king",
				"black-king",
			] as const
		).filter((chessman) => {
			const { type } = getChessmanInfo(chessman);

			switch (type) {
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

		const sourceChessmanInfo = getChessmanInfo(sourceChessman);
		const destinationChessmanInfo = getChessmanInfo(destinationChessman);

		if (sourceChessmanInfo.color === destinationChessmanInfo.color) {
			return false;
		}

		if (destinationChessmanInfo.type === "king") {
			return false;
		}

		return true;
	}

	canRemoveChessman(coordinate: BoardCoordinate): boolean {
		const chessman = this._board.getChessmanByCoordinate(coordinate);

		if (!chessman) {
			return false;
		}

		const { type } = getChessmanInfo(chessman);

		if (type === "king") {
			return false;
		}

		return true;
	}

	@action
	addChessman(coordinate: BoardCoordinate, chessman: Chessman): void {
		assert(this.#canAddChessman(coordinate, chessman), "Incorrect invariant for adding");

		this._board = this._board.addChessman(coordinate, chessman);

		this.#history.pushRecord({
			item: {
				action: "adding",
				chessman,
				coordinate,
			},
			boardState: this._board.state,
		});
	}

	@action
	moveChessman(sourceCoordinate: BoardCoordinate, destinationCoordinate: BoardCoordinate): void {
		assert(this.canMoveChessman(sourceCoordinate, destinationCoordinate), "Incorrect invariant for moving");

		const chessman = this._board.getChessmanByCoordinate(sourceCoordinate)!;
		const isCapture = this._board.hasChessmanByCoordinate(destinationCoordinate);

		this._board = this._board.removeChessman(sourceCoordinate).addChessman(destinationCoordinate, chessman);

		this.#history.pushRecord({
			item: {
				action: "moving",
				chessman,
				sourceCoordinate,
				destinationCoordinate,
				isCapture,
			},
			boardState: this._board.state,
		});
	}

	@action
	removeChessman(coordinate: BoardCoordinate): void {
		assert(this.canRemoveChessman(coordinate), "Incorrect invariant for removing");

		const chessman = this._board.getChessmanByCoordinate(coordinate)!;
		this._board = this._board.removeChessman(coordinate);

		this.#history.pushRecord({
			item: {
				action: "removing",
				chessman,
				coordinate,
			},
			boardState: this._board.state,
		});
	}

	#canAddChessman(coordinate: BoardCoordinate, chessman: Chessman): boolean {
		if (this._board.hasChessmanByCoordinate(coordinate)) {
			return false;
		}

		return this.availableChessmenForAdding.some((availableChessman) => availableChessman === chessman);
	}

	#handleHistoryChanged = (): void => {
		const { currentBoardState } = this.#history;
		this._board = Board.createFromState(currentBoardState);
	};
}
