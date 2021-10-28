import type { Chessman, ChessmenArrangement } from "../app-values";

import { app } from "../app-components";
import { initialChessmenArrangement } from "../app-values";

describe("complex cases", () => {
	beforeEach(() => {
		cy.visit("");
	});

	it("playing full game", () => {
		app.moveChessman("white-pawn", "e2", "e4");
		app.moveChessman("black-pawn", "b7", "b6");
		app.moveChessman("white-pawn", "d2", "d4");
		app.moveChessman("black-bishop", "c8", "b7");
		app.moveChessman("white-knight", "b1", "c3");
		app.moveChessman("black-pawn", "e7", "e6");
		app.moveChessman("white-pawn", "d4", "d5");
		app.moveChessman("black-knight", "g8", "e7");
		app.moveChessman("white-pawn", "d5", "e6");
		app.moveChessman("black-pawn", "f7", "e6");
		app.moveChessman("white-bishop", "c1", "g5");
		app.moveChessman("black-knight", "b8", "c6");
		app.moveChessman("white-knight", "g1", "f3");
		app.moveChessman("black-pawn", "h7", "h6");
		app.moveChessman("white-bishop", "g5", "h4");
		app.moveChessman("black-pawn", "g7", "g5");
		app.moveChessman("white-bishop", "h4", "g3");
		app.moveChessman("black-pawn", "a7", "a6");
		app.moveChessman("white-knight", "f3", "e5");
		app.moveChessman("black-pawn", "h6", "h5");
		app.moveChessman("white-knight", "e5", "c6");
		app.moveChessman("black-bishop", "b7", "c6");
		app.moveChessman("white-bishop", "f1", "e2");
		app.moveChessman("black-rook", "h8", "g8");
		app.moveChessman("white-bishop", "e2", "h5");
		app.moveChessman("black-knight", "e7", "g6");
		app.moveChessman("white-queen", "d1", "d3");
		app.moveChessman("black-bishop", "c6", "b5");
		app.moveChessman("white-knight", "c3", "b5");
		app.moveChessman("black-pawn", "a6", "b5");
		app.moveChessman("white-pawn", "e4", "e5");
		app.moveChessman("black-king", "e8", "f7");
		app.moveChessman("white-pawn", "f2", "f4");
		app.moveChessman("black-pawn", "g5", "f4");
		app.moveChessman("white-rook", "h1", "f1");
		app.moveChessman("white-king", "e1", "g1");
		app.moveChessman("black-bishop", "f8", "h6");
		app.moveChessman("white-bishop", "g3", "f4");
		app.moveChessman("black-bishop", "h6", "f4");
		app.moveChessman("white-rook", "f1", "f4");
		app.moveChessman("black-king", "f7", "e7");
		app.moveChessman("white-bishop", "h5", "g6");
		app.moveChessman("black-rook", "g8", "f8");
		app.moveChessman("white-queen", "d3", "d4");
		app.moveChessman("black-rook", "a8", "a4");
		app.moveChessman("white-pawn", "b2", "b4");
		app.moveChessman("black-rook", "a4", "a8");
		app.moveChessman("white-rook", "a1", "f1");
		app.moveChessman("black-rook", "a8", "a2");
		app.moveChessman("white-rook", "f4", "f7");
		app.moveChessman("black-rook", "f8", "f7");
		app.moveChessman("white-rook", "f1", "f7");
		app.moveChessman("black-king", "e7", "e8");
		app.moveChessman("white-rook", "f7", "d7");
		app.moveChessman("black-king", "e8", "f8");
		app.moveChessman("white-queen", "d4", "f4");
		app.moveChessman("black-king", "f8", "g8");
		app.moveChessman("white-queen", "f4", "f7");
		app.moveChessman("black-king", "g8", "h8");
		app.moveChessman("white-queen", "f7", "h7");
	});

	it("set custom position", () => {
		const kings: Chessman[] = ["white-king", "black-king"];

		const chessmenArrangement: ChessmenArrangement = [
			["e3", "white-king"],
			["d6", "black-king"],
			["c5", "white-rook"],
			["b7", "black-rook"],
			["a5", "white-pawn"],
			["b4", "white-pawn"],
			["d4", "white-pawn"],
			["f5", "white-pawn"],
			["g4", "white-pawn"],
			["h4", "white-pawn"],
			["a6", "black-pawn"],
			["c6", "black-pawn"],
			["f6", "black-pawn"],
			["g7", "black-pawn"],
			["h6", "black-pawn"],
		];

		initialChessmenArrangement
			.filter(([, chessman]) => !kings.includes(chessman))
			.forEach(([coordinate, chessman]) => {
				app.removeChessman(chessman, coordinate);
			});

		chessmenArrangement.forEach(([coordinate, chessman]) => {
			if (chessman === "white-king") {
				app.moveChessman(chessman, "e1", coordinate);
				return;
			}

			if (chessman === "black-king") {
				app.moveChessman(chessman, "e8", coordinate);
				return;
			}

			app.addChessman(chessman, coordinate);
		});
	});

	it("playing with going back & forward", () => {
		app.moveChessman("white-pawn", "d2", "d4");

		app.newGame();
		app.flipBoard();

		app.moveChessman("white-pawn", "e2", "e4");
		app.moveChessman("black-pawn", "e7", "e5");
		app.moveChessman("white-knight", "g1", "f3");

		app.goBack();
		app.goBack();
		app.goBack();

		app.assertChessmenArrangement(initialChessmenArrangement);

		app.goForward();
		app.goForward();
		app.goForward();

		app.moveChessman("black-knight", "b8", "c6");
		app.moveChessman("white-bishop", "f1", "c4");
		app.moveChessman("black-bishop", "f8", "b4");

		app.goBack();
		app.moveChessman("black-bishop", "f8", "c5");
		app.moveChessman("white-rook", "h1", "f1");
		app.moveChessman("white-king", "e1", "g1");
		app.moveChessman("black-pawn", "d7", "d6");
		app.moveChessman("white-pawn", "d2", "d4");

		app.goBack();
		app.goBack();
		app.goBack();
		app.goForward();
		app.moveChessman("black-knight", "g8", "f6");
		app.moveChessman("white-knight", "b1", "c3");
		app.moveChessman("black-rook", "h8", "f8");
		app.moveChessman("black-king", "e8", "g8");
		app.moveChessman("white-pawn", "d2", "d3");
		app.moveChessman("black-pawn", "h7", "h6");
	});
});
