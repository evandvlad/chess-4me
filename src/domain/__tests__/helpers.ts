import type { BoardCoordinate, Chessman } from "..";
import type { Game } from "..";

const data: {
	boardCoordinates: ReadonlyArray<BoardCoordinate>;
	initialChessmenArrangement: ReadonlyArray<[BoardCoordinate, Chessman | null]>;
} = (() => {
	const initialChessmenArrangementRecord: Record<BoardCoordinate, Chessman | null> = {
		a1: { color: "white", type: "rook" },
		a2: { color: "white", type: "pawn" },
		a3: null,
		a4: null,
		a5: null,
		a6: null,
		a7: { color: "black", type: "pawn" },
		a8: { color: "black", type: "rook" },
		b1: { color: "white", type: "knight" },
		b2: { color: "white", type: "pawn" },
		b3: null,
		b4: null,
		b5: null,
		b6: null,
		b7: { color: "black", type: "pawn" },
		b8: { color: "black", type: "knight" },
		c1: { color: "white", type: "bishop" },
		c2: { color: "white", type: "pawn" },
		c3: null,
		c4: null,
		c5: null,
		c6: null,
		c7: { color: "black", type: "pawn" },
		c8: { color: "black", type: "bishop" },
		d1: { color: "white", type: "queen" },
		d2: { color: "white", type: "pawn" },
		d3: null,
		d4: null,
		d5: null,
		d6: null,
		d7: { color: "black", type: "pawn" },
		d8: { color: "black", type: "queen" },
		e1: { color: "white", type: "king" },
		e2: { color: "white", type: "pawn" },
		e3: null,
		e4: null,
		e5: null,
		e6: null,
		e7: { color: "black", type: "pawn" },
		e8: { color: "black", type: "king" },
		f1: { color: "white", type: "bishop" },
		f2: { color: "white", type: "pawn" },
		f3: null,
		f4: null,
		f5: null,
		f6: null,
		f7: { color: "black", type: "pawn" },
		f8: { color: "black", type: "bishop" },
		g1: { color: "white", type: "knight" },
		g2: { color: "white", type: "pawn" },
		g3: null,
		g4: null,
		g5: null,
		g6: null,
		g7: { color: "black", type: "pawn" },
		g8: { color: "black", type: "knight" },
		h1: { color: "white", type: "rook" },
		h2: { color: "white", type: "pawn" },
		h3: null,
		h4: null,
		h5: null,
		h6: null,
		h7: { color: "black", type: "pawn" },
		h8: { color: "black", type: "rook" },
	};

	return {
		boardCoordinates: Object.keys(initialChessmenArrangementRecord) as BoardCoordinate[],
		initialChessmenArrangement: Object.entries(initialChessmenArrangementRecord) as Array<
			[BoardCoordinate, Chessman | null]
		>,
	};
})();

export function expectChessmenArrangement({
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

export function expectNewGameState(game: Game): void {
	expectChessmenArrangement({ game });
	expect(game.history.canGoBack).to.equal(false);
}

export function expectGameBoardStatesAreSame(game1: Game, game2: Game): void {
	expect(game1.board.activeCoordinate).to.equal(game2.board.activeCoordinate);

	const areAllChessmenInSamePositions = data.boardCoordinates.every((coordinate) => {
		const chessman1 = game1.board.getChessmanByCoordinate(coordinate);
		const chessman2 = game2.board.getChessmanByCoordinate(coordinate);

		return chessman1?.color === chessman2?.color && chessman1?.type === chessman2?.type;
	});

	expect(areAllChessmenInSamePositions).to.equal(true);
}
