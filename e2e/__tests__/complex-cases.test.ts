import type { ChessmenMap } from "../app-values";

import { assertChessmenMapsAreEquals, assertOptionalValueBox } from "../helpers/asserts";
import { game, board, controls, history, sidebarTabs, chessmenDiff } from "../app-components";
import { initialChessmenArrangement } from "../app-values";

describe("complex cases", () => {
	beforeEach(() => {
		cy.visit("");
	});

	it("playing full game", () => {
		game.moveChessman("white-pawn", "e2", "e4");
		game.moveChessman("black-pawn", "b7", "b6");
		game.moveChessman("white-pawn", "d2", "d4");
		game.moveChessman("black-bishop", "c8", "b7");
		game.moveChessman("white-knight", "b1", "c3");
		game.moveChessman("black-pawn", "e7", "e6");
		game.moveChessman("white-pawn", "d4", "d5");
		game.moveChessman("black-knight", "g8", "e7");
		game.moveChessman("white-pawn", "d5", "e6");
		game.moveChessman("black-pawn", "f7", "e6");
		game.moveChessman("white-bishop", "c1", "g5");
		game.moveChessman("black-knight", "b8", "c6");
		game.moveChessman("white-knight", "g1", "f3");
		game.moveChessman("black-pawn", "h7", "h6");
		game.moveChessman("white-bishop", "g5", "h4");
		game.moveChessman("black-pawn", "g7", "g5");
		game.moveChessman("white-bishop", "h4", "g3");
		game.moveChessman("black-pawn", "a7", "a6");
		game.moveChessman("white-knight", "f3", "e5");
		game.moveChessman("black-pawn", "h6", "h5");
		game.moveChessman("white-knight", "e5", "c6");
		game.moveChessman("black-bishop", "b7", "c6");
		game.moveChessman("white-bishop", "f1", "e2");
		game.moveChessman("black-rook", "h8", "g8");
		game.moveChessman("white-bishop", "e2", "h5");
		game.moveChessman("black-knight", "e7", "g6");
		game.moveChessman("white-queen", "d1", "d3");
		game.moveChessman("black-bishop", "c6", "b5");
		game.moveChessman("white-knight", "c3", "b5");
		game.moveChessman("black-pawn", "a6", "b5");
		game.moveChessman("white-pawn", "e4", "e5");
		game.moveChessman("black-king", "e8", "f7");
		game.moveChessman("white-pawn", "f2", "f4");
		game.moveChessman("black-pawn", "g5", "f4");
		game.moveChessman("white-rook", "h1", "f1");
		game.moveChessman("white-king", "e1", "g1");
		game.moveChessman("black-bishop", "f8", "h6");
		game.moveChessman("white-bishop", "g3", "f4");
		game.moveChessman("black-bishop", "h6", "f4");
		game.moveChessman("white-rook", "f1", "f4");
		game.moveChessman("black-king", "f7", "e7");
		game.moveChessman("white-bishop", "h5", "g6");
		game.moveChessman("black-rook", "g8", "f8");
		game.moveChessman("white-queen", "d3", "d4");
		game.moveChessman("black-rook", "a8", "a4");
		game.moveChessman("white-pawn", "b2", "b4");
		game.moveChessman("black-rook", "a4", "a8");
		game.moveChessman("white-rook", "a1", "f1");
		game.moveChessman("black-rook", "a8", "a2");
		game.moveChessman("white-rook", "f4", "f7");
		game.moveChessman("black-rook", "f8", "f7");
		game.moveChessman("white-rook", "f1", "f7");
		game.moveChessman("black-king", "e7", "e8");
		game.moveChessman("white-rook", "f7", "d7");
		game.moveChessman("black-king", "e8", "f8");
		game.moveChessman("white-queen", "d4", "f4");
		game.moveChessman("black-king", "f8", "g8");
		game.moveChessman("white-queen", "f4", "f7");
		game.moveChessman("black-king", "g8", "h8");
		game.moveChessman("white-queen", "f7", "h7");
	});

	it("set custom position", () => {
		const chessmenMap: ChessmenMap = new Map([
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
		]);

		controls.performAction("empty-board");

		chessmenMap.forEach((chessman, coordinate) => {
			game.addChessman(chessman, coordinate);
		});

		board.getChessmenMap().should(assertChessmenMapsAreEquals(chessmenMap));
	});

	it("playing with going back & forward", () => {
		game.moveChessman("white-pawn", "d2", "d4");

		controls.performAction("new-game");
		controls.performAction("flip-board");

		game.moveChessman("white-pawn", "e2", "e4");
		game.moveChessman("black-pawn", "e7", "e5");
		game.moveChessman("white-knight", "g1", "f3");

		controls.performAction("go-back");
		controls.performAction("go-back");
		controls.performAction("go-back");

		board.getChessmenMap().should(assertChessmenMapsAreEquals(initialChessmenArrangement));

		controls.performAction("go-forward");
		controls.performAction("go-forward");
		controls.performAction("go-forward");

		game.moveChessman("black-knight", "b8", "c6");
		game.moveChessman("white-bishop", "f1", "c4");
		game.moveChessman("black-bishop", "f8", "b4");

		controls.performAction("go-back");

		game.moveChessman("black-bishop", "f8", "c5");
		game.moveChessman("white-rook", "h1", "f1");
		game.moveChessman("white-king", "e1", "g1");
		game.moveChessman("black-pawn", "d7", "d6");
		game.moveChessman("white-pawn", "d2", "d4");

		controls.performAction("go-back");
		controls.performAction("go-back");
		controls.performAction("go-back");
		controls.performAction("go-forward");

		game.moveChessman("black-knight", "g8", "f6");
		game.moveChessman("white-knight", "b1", "c3");
		game.moveChessman("black-rook", "h8", "f8");
		game.moveChessman("black-king", "e8", "g8");
		game.moveChessman("white-pawn", "d2", "d3");
		game.moveChessman("black-pawn", "h7", "h6");
	});

	it("different actions & history items", () => {
		game.moveChessman("white-pawn", "e2", "e4");
		game.moveChessman("black-pawn", "e7", "e5");
		game.moveChessman("white-knight", "g1", "f3");

		history.selectByIndex(0);

		game.moveChessman("black-pawn", "d7", "d5");
		game.moveChessman("white-pawn", "d2", "d4");
		game.moveChessman("black-pawn", "d5", "e4");

		history.selectByIndex(1);

		game.moveChessman("white-pawn", "e4", "d5");
		game.moveChessman("black-queen", "d8", "d5");
		game.moveChessman("white-pawn", "d2", "d4");

		history.selectByIndex(3);

		game.removeChessman("white-pawn", "d2");
		game.addChessman("white-pawn", "d4");

		history.selectByIndex(0);
		controls.performAction("go-back");

		board.getChessmenMap().should(assertChessmenMapsAreEquals(initialChessmenArrangement));

		history.selectByIndex(5);

		history
			.getItems()
			.should("eql", [
				"adding:white-pawn:d4",
				"removing:white-pawn:d2",
				"moving:black-queen:d8xd5",
				"moving:white-pawn:e4xd5",
				"moving:black-pawn:d7-d5",
				"moving:white-pawn:e2-e4",
			]);

		history.getCurrentItemIndex().should(assertOptionalValueBox<number>(5));
	});

	it("chessmen diff", () => {
		sidebarTabs.goToTab("diff");
		controls.performAction("empty-board");

		game.addChessman("white-pawn", "a2");
		game.addChessman("white-rook", "a1");

		chessmenDiff.getItems().should("eql", ["white-rook:1", "white-pawn:1"]);

		game.addChessman("white-pawn", "b2");
		game.addChessman("white-knight", "b1");
		game.addChessman("white-pawn", "c2");

		chessmenDiff.getItems().should("eql", ["white-rook:1", "white-knight:1", "white-pawn:3"]);

		game.addChessman("black-pawn", "a7");
		game.addChessman("black-pawn", "b7");

		chessmenDiff.getItems().should("eql", ["white-rook:1", "white-knight:1", "white-pawn:1"]);

		game.addChessman("black-pawn", "c7");
		game.addChessman("black-knight", "b8");
		game.addChessman("black-bishop", "c8");

		chessmenDiff.getItems().should("eql", ["white-rook:1", "black-bishop:1"]);

		game.addChessman("white-bishop", "c1");
		game.addChessman("white-queen", "d1");
		game.addChessman("white-king", "e1");
		game.addChessman("white-bishop", "f1");

		chessmenDiff.getItems().should("eql", ["white-king:1", "white-queen:1", "white-rook:1", "white-bishop:1"]);

		game.addChessman("black-pawn", "d7");
		game.addChessman("black-pawn", "e7");
		game.addChessman("black-pawn", "f7");
		game.addChessman("black-pawn", "g7");
		game.addChessman("black-pawn", "h7");

		chessmenDiff
			.getItems()
			.should("eql", ["white-king:1", "white-queen:1", "white-rook:1", "white-bishop:1", "black-pawn:5"]);

		game.addChessman("black-rook", "a8");
		game.addChessman("black-rook", "h8");
		game.addChessman("white-pawn", "d2");
		game.addChessman("white-pawn", "e2");
		game.addChessman("white-pawn", "f2");

		chessmenDiff
			.getItems()
			.should("eql", ["white-king:1", "white-queen:1", "white-bishop:1", "black-rook:1", "black-pawn:2"]);

		game.addChessman("black-knight", "g8");
		game.addChessman("black-bishop", "f8");
		game.addChessman("black-king", "e8");
		game.addChessman("black-queen", "d8");

		chessmenDiff.getItems().should("eql", ["black-rook:1", "black-knight:1", "black-pawn:2"]);

		game.addChessman("white-knight", "g1");
		game.addChessman("white-rook", "h1");
		game.addChessman("white-pawn", "g2");
		game.addChessman("white-pawn", "h2");

		chessmenDiff.getItems().should("eql", []);

		controls.performAction("go-back");
		controls.performAction("go-back");

		chessmenDiff.getItems().should("eql", ["black-pawn:2"]);

		controls.performAction("go-forward");
		controls.performAction("go-forward");

		chessmenDiff.getItems().should("eql", []);

		sidebarTabs.goToTab("history");

		history.selectByIndex(22);

		sidebarTabs.goToTab("diff");

		chessmenDiff
			.getItems()
			.should("eql", ["white-king:1", "white-queen:1", "white-bishop:1", "black-rook:1", "black-pawn:3"]);

		controls.performAction("new-game");
		chessmenDiff.getItems().should("eql", []);
	});
});
