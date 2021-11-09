import type { BoardCoordinate, Chessman } from "..";
import type { Game } from "..";

const data: {
	boardCoordinates: ReadonlyArray<BoardCoordinate>;
	initialChessmenArrangement: ReadonlyArray<[BoardCoordinate, Chessman | null]>;
} = (() => {
	const initialChessmenArrangementRecord: Record<BoardCoordinate, Chessman | null> = {
		a1: "white-rook",
		a2: "white-pawn",
		a3: null,
		a4: null,
		a5: null,
		a6: null,
		a7: "black-pawn",
		a8: "black-rook",
		b1: "white-knight",
		b2: "white-pawn",
		b3: null,
		b4: null,
		b5: null,
		b6: null,
		b7: "black-pawn",
		b8: "black-knight",
		c1: "white-bishop",
		c2: "white-pawn",
		c3: null,
		c4: null,
		c5: null,
		c6: null,
		c7: "black-pawn",
		c8: "black-bishop",
		d1: "white-queen",
		d2: "white-pawn",
		d3: null,
		d4: null,
		d5: null,
		d6: null,
		d7: "black-pawn",
		d8: "black-queen",
		e1: "white-king",
		e2: "white-pawn",
		e3: null,
		e4: null,
		e5: null,
		e6: null,
		e7: "black-pawn",
		e8: "black-king",
		f1: "white-bishop",
		f2: "white-pawn",
		f3: null,
		f4: null,
		f5: null,
		f6: null,
		f7: "black-pawn",
		f8: "black-bishop",
		g1: "white-knight",
		g2: "white-pawn",
		g3: null,
		g4: null,
		g5: null,
		g6: null,
		g7: "black-pawn",
		g8: "black-knight",
		h1: "white-rook",
		h2: "white-pawn",
		h3: null,
		h4: null,
		h5: null,
		h6: null,
		h7: "black-pawn",
		h8: "black-rook",
	};

	return {
		boardCoordinates: Object.keys(initialChessmenArrangementRecord) as BoardCoordinate[],
		initialChessmenArrangement: Object.entries(initialChessmenArrangementRecord) as Array<
			[BoardCoordinate, Chessman | null]
		>,
	};
})();

export function expectRegularGameChessmenArrangement({
	game,
	changeMap = new Map(),
	activeCoordinate = null,
}: {
	game: Game;
	changeMap?: ReadonlyMap<BoardCoordinate, Chessman | null>;
	activeCoordinate?: BoardCoordinate | null;
}): void {
	data.initialChessmenArrangement.forEach(([coordinate, chessman]) => {
		const expected = changeMap.has(coordinate) ? changeMap.get(coordinate)! : chessman;

		expect(game.board.getChessmanByCoordinate(coordinate)).to.eql(expected);
		expect(game.board.activeCoordinate).to.equal(activeCoordinate);
	});
}

export function expectChessmanArrangement({
	game,
	chessmenMap,
	activeCoordinate = null,
}: {
	game: Game;
	chessmenMap: ReadonlyMap<BoardCoordinate, Chessman | null>;
	activeCoordinate?: BoardCoordinate | null;
}) {
	data.boardCoordinates.forEach((coordinate) => {
		const chessman = chessmenMap.get(coordinate) ?? null;
		expect(game.board.getChessmanByCoordinate(coordinate)).to.eql(chessman);
	});

	expect(game.board.activeCoordinate).to.equal(activeCoordinate);
}
