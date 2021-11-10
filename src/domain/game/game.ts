import { action, makeObservable, observable } from "mobx";

import type { Coordinate } from "../board";
import type { Chessman, ChessmenMap } from "../chessmen";
import type { HistoryClientAPI, HistoryItem } from "./history";

import { BoardState } from "./board-state";
import { getChessmanInfo, chessmenArrangement, chessmen } from "../chessmen";
import { assert } from "~/utils/assert";
import { History } from "./history";
import { ChessmenDiff } from "./chessmen-diff";

type BoardStateChangedEvent =
	| {
			type: "board-action";
			data: HistoryItem;
	  }
	| {
			type: "history-action";
	  };

export class Game {
	@observable.ref boardState: BoardState;
	#history: History;
	#chessmenDiff: ChessmenDiff;

	static createOnRegularMode() {
		return new this(chessmenArrangement);
	}

	static createOnEmptyBoardMode() {
		return new this();
	}

	private constructor(chessmenMap: ChessmenMap = new Map()) {
		makeObservable(this);

		this.boardState = new BoardState(chessmenMap);

		this.#history = new History({
			boardState: this.boardState,
			onChanged: this.#handleHistoryChanged,
		});

		this.#chessmenDiff = new ChessmenDiff(this.boardState.chessmenMap);
	}

	get chessmenDiffDetails() {
		return this.#chessmenDiff.details;
	}

	get history(): HistoryClientAPI {
		return this.#history;
	}

	get availableChessmenForAdding(): ReadonlyArray<Chessman> {
		const chessmenCountMap = this.#collectChessmenCountMap();

		return chessmen.filter((chessman) => {
			const { type } = getChessmanInfo(chessman);

			switch (type) {
				case "pawn":
					return (chessmenCountMap.get(chessman) ?? 0) < 8;

				case "king":
					return !chessmenCountMap.get(chessman);

				default:
					return true;
			}
		});
	}

	canMoveChessman(chessman: Chessman, sourceCoordinate: Coordinate, destinationCoordinate: Coordinate) {
		const { chessmenMap } = this.boardState;

		if (chessman !== chessmenMap.get(sourceCoordinate)) {
			return false;
		}

		const destinationChessman = chessmenMap.get(destinationCoordinate);

		if (!destinationChessman) {
			return true;
		}

		const sourceChessmanInfo = getChessmanInfo(chessman);
		const destinationChessmanInfo = getChessmanInfo(destinationChessman);

		if (sourceChessmanInfo.color === destinationChessmanInfo.color) {
			return false;
		}

		if (destinationChessmanInfo.type === "king") {
			return false;
		}

		return true;
	}

	canRemoveChessman(chessman: Chessman, coordinate: Coordinate) {
		const { chessmenMap } = this.boardState;

		if (chessman !== chessmenMap.get(coordinate)) {
			return false;
		}

		const { type } = getChessmanInfo(chessman);

		if (type === "king") {
			return false;
		}

		return true;
	}

	@action
	addChessman(chessman: Chessman, coordinate: Coordinate) {
		assert(this.#canAddChessman(chessman, coordinate), "Incorrect invariant for adding");

		const { chessmenMap } = this.boardState;
		const newChessmenMap = new Map(chessmenMap.entries());

		newChessmenMap.set(coordinate, chessman);

		this.boardState = new BoardState(newChessmenMap, coordinate);

		this.#handleBoardStateChanged({
			type: "board-action",
			data: {
				action: "adding",
				chessman,
				coordinate,
			},
		});
	}

	@action
	moveChessman(chessman: Chessman, sourceCoordinate: Coordinate, destinationCoordinate: Coordinate) {
		assert(
			this.canMoveChessman(chessman, sourceCoordinate, destinationCoordinate),
			"Incorrect invariant for moving",
		);

		const { chessmenMap } = this.boardState;
		const isCapture = chessmenMap.has(destinationCoordinate);

		const newChessmenMap = new Map(chessmenMap.entries());

		newChessmenMap.delete(sourceCoordinate);
		newChessmenMap.set(destinationCoordinate, chessman);

		this.boardState = new BoardState(newChessmenMap, destinationCoordinate);

		this.#handleBoardStateChanged({
			type: "board-action",
			data: {
				action: "moving",
				chessman,
				sourceCoordinate,
				destinationCoordinate,
				isCapture,
			},
		});
	}

	@action
	removeChessman(chessman: Chessman, coordinate: Coordinate) {
		assert(this.canRemoveChessman(chessman, coordinate), "Incorrect invariant for removing");

		const newChessmenMap = new Map(this.boardState.chessmenMap.entries());

		newChessmenMap.delete(coordinate);

		this.boardState = new BoardState(newChessmenMap, coordinate);

		this.#handleBoardStateChanged({
			type: "board-action",
			data: {
				action: "removing",
				chessman,
				coordinate,
			},
		});
	}

	#canAddChessman(chessman: Chessman, coordinate: Coordinate) {
		const { chessmenMap } = this.boardState;

		if (chessmenMap.has(coordinate)) {
			return false;
		}

		return this.availableChessmenForAdding.some((availableChessman) => availableChessman === chessman);
	}

	#handleHistoryChanged = () => {
		const { chessmenMap, activeCoordinate } = this.#history.currentBoardState;
		this.boardState = new BoardState(chessmenMap, activeCoordinate);
		this.#handleBoardStateChanged({ type: "history-action" });
	};

	#handleBoardStateChanged(event: BoardStateChangedEvent) {
		if (event.type === "board-action") {
			this.#history.pushRecord({
				item: event.data,
				boardState: this.boardState,
			});
		}

		this.#chessmenDiff.updateChessmenMap(this.boardState.chessmenMap);
	}

	#collectChessmenCountMap() {
		const result = new Map<Chessman, number>();

		this.boardState.chessmenMap.forEach((chessman) => {
			const count = (result.get(chessman) ?? 0) + 1;
			result.set(chessman, count);
		});

		return result;
	}
}
