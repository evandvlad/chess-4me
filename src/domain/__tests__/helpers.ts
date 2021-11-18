import type { Game, BoardCoordinate, HistoryItem, Chessman, ChessmenDiffItem } from "..";

import { boardCoordinates } from "..";

type ChessmenMap = Map<BoardCoordinate, Chessman>;
type GameMode = "regular" | "empty board";

export const initialChessmenArrangement: ChessmenMap = new Map([
	["a2", "white-pawn"],
	["b2", "white-pawn"],
	["c2", "white-pawn"],
	["d2", "white-pawn"],
	["e2", "white-pawn"],
	["f2", "white-pawn"],
	["g2", "white-pawn"],
	["h2", "white-pawn"],
	["a1", "white-rook"],
	["b1", "white-knight"],
	["c1", "white-bishop"],
	["d1", "white-queen"],
	["e1", "white-king"],
	["f1", "white-bishop"],
	["g1", "white-knight"],
	["h1", "white-rook"],
	["a7", "black-pawn"],
	["b7", "black-pawn"],
	["c7", "black-pawn"],
	["d7", "black-pawn"],
	["e7", "black-pawn"],
	["f7", "black-pawn"],
	["g7", "black-pawn"],
	["h7", "black-pawn"],
	["a8", "black-rook"],
	["b8", "black-knight"],
	["c8", "black-bishop"],
	["d8", "black-queen"],
	["e8", "black-king"],
	["f8", "black-bishop"],
	["g8", "black-knight"],
	["h8", "black-rook"],
]);

export class ChessmenMapTuner {
	#chessmenMap: ChessmenMap;

	constructor(initialChessmenMap: ChessmenMap = new Map()) {
		this.#chessmenMap = new Map(initialChessmenMap.entries());
	}

	set(coordinate: BoardCoordinate, chessman: Chessman) {
		this.#chessmenMap.set(coordinate, chessman);
		return this;
	}

	remove(...coordinates: BoardCoordinate[]) {
		coordinates.forEach((coordinate) => {
			this.#chessmenMap.delete(coordinate);
		});

		return this;
	}

	getMap() {
		return this.#chessmenMap;
	}
}

export class HistoryItemsTuner {
	#items: HistoryItem[] = [];

	pushAddingAction(chessman: Chessman, coordinate: BoardCoordinate) {
		this.#items.push({
			action: "adding",
			chessman,
			coordinate,
		});

		return this;
	}

	pushRemovingAction(chessman: Chessman, coordinate: BoardCoordinate) {
		this.#items.push({
			action: "removing",
			chessman,
			coordinate,
		});

		return this;
	}

	pushMovingAction(
		chessman: Chessman,
		sourceCoordinate: BoardCoordinate,
		destinationCoordinate: BoardCoordinate,
		isCapture = false,
	) {
		this.#items.push({
			action: "moving",
			chessman,
			sourceCoordinate,
			destinationCoordinate,
			isCapture,
		});

		return this;
	}

	getItems() {
		return this.#items;
	}

	getSingleItem() {
		if (!this.#items[0]) {
			throw new Error("History items are empty");
		}

		return this.#items[0];
	}
}

export function expectCorrectBoardState(game: Game, boardState: Game["boardState"]) {
	boardCoordinates.forEach((coordinate) => {
		expect(game.boardState.chessmenMap.get(coordinate)).to.equal(
			boardState.chessmenMap.get(coordinate),
			`Assertion on check chessmenMap on "${coordinate}" coordinate`,
		);
	});

	expect(game.boardState.activeCoordinate).to.equal(
		boardState.activeCoordinate,
		"Assertion on check activeCoordinate",
	);
}

export function expectCorrectHistoryState(
	game: Game,
	expectedParams: {
		items: HistoryItem[];
		canGoBack: boolean;
		canGoForward: boolean;
		currentIndex: number | undefined;
	},
) {
	expect(game.history.canGoBack).to.equal(expectedParams.canGoBack, "Assertion on check canGoBack");
	expect(game.history.canGoForward).to.equal(expectedParams.canGoForward, "Assertion on check canGoForward");
	expect(game.history.items.length).to.equal(expectedParams.items.length, "Assertion on check history items length");

	game.history.items.forEach((item, index) => {
		expect(item).to.eql(expectedParams.items[index], "Assetion on check history item");
	});

	if (typeof expectedParams.currentIndex === "undefined") {
		expect(game.history.isCurrentHistoryIndex(0)).to.equal(false, "Assertion on check isCurrentHistoryIndex");
	} else {
		expect(game.history.isCurrentHistoryIndex(expectedParams.currentIndex)).to.equal(
			true,
			"Assertion on check isCurrentHistoryIndex",
		);
	}
}

export function expectCorrectChessmenDiffState(game: Game, expectedItems: ChessmenDiffItem[]) {
	const currentItems = [...game.chessmenDiffDetails.values()].flat();
	expect(currentItems).to.eql(expectedItems);
}

export function expectCorrectNewGameState(game: Game, mode: GameMode) {
	expectCorrectBoardState(game, {
		activeCoordinate: null,
		chessmenMap: mode === "regular" ? initialChessmenArrangement : new Map(),
	});

	expectCorrectHistoryState(game, {
		canGoBack: false,
		canGoForward: false,
		currentIndex: undefined,
		items: [],
	});

	expectCorrectChessmenDiffState(game, []);
}

export function expectCorrectGameStateAfterSingleAction(
	game: Game,
	expectedParams: {
		chessmanMap: ChessmenMap;
		activeCoordinate: BoardCoordinate | null;
		historyItem: HistoryItem;
	},
) {
	expectCorrectBoardState(game, {
		chessmenMap: expectedParams.chessmanMap,
		activeCoordinate: expectedParams.activeCoordinate,
	});

	expectCorrectHistoryState(game, {
		canGoBack: true,
		canGoForward: false,
		currentIndex: 0,
		items: [expectedParams.historyItem],
	});
}
