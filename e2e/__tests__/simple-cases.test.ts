import type { BoardCoordinate, Chessman } from "../app-values";

import { comparePositionsOnScreens } from "../helpers/position-on-screen";
import { assertOptionalValueBox, assertChessmenMapsAreEquals } from "../helpers/asserts";
import { board, controls, game, addChessmanDialog, history, sidebarTabs, chessmenDiff } from "../app-components";
import { initialChessmenArrangement, allChessmen } from "../app-values";

describe("simple cases", () => {
	beforeEach(() => {
		cy.visit("");
	});

	it("initial state", () => {
		board.getDirection().should("equal", "regular");
		board.getSelectedCell().should(assertOptionalValueBox<BoardCoordinate>(null));
		board.getFocusedCell().should(assertOptionalValueBox<BoardCoordinate>(null));

		board.getChessmenMap().should(assertChessmenMapsAreEquals(initialChessmenArrangement));

		controls.isControlAvailable("empty-board").should("equal", true);
		controls.isControlAvailable("new-game").should("equal", true);
		controls.isControlAvailable("flip-board").should("equal", true);
		controls.isControlAvailable("go-back").should("equal", false);
		controls.isControlAvailable("go-forward").should("equal", false);
		controls.isControlAvailable("add-chessman").should("equal", false);
		controls.isControlAvailable("remove-chessman").should("equal", false);

		sidebarTabs.getActiveTab().should("equal", "history");
		history.getItems().should("eql", []);
	});

	describe("flip board", () => {
		it("position on UI", () => {
			board.getCellPositionsOnScreen(["a1", "h8"]).then((regularBoard) => {
				controls.performAction("flip-board");

				board.getCellPositionsOnScreen(["a1", "h8"]).then((flippedBoard) => {
					expect(comparePositionsOnScreens(regularBoard.get("a1")!, flippedBoard.get("a1")!)).eql({
						x: 1,
						y: -1,
					});

					expect(comparePositionsOnScreens(regularBoard.get("h8")!, flippedBoard.get("h8")!)).eql({
						x: -1,
						y: 1,
					});

					expect(comparePositionsOnScreens(regularBoard.get("a1")!, flippedBoard.get("h8")!)).eql({
						x: 0,
						y: 0,
					});
				});

				board.getDirection().should("equal", "flipped");
			});
		});

		it("chesmen arrangement isn't changed", () => {
			controls.performAction("flip-board");
			board.getChessmenMap().should(assertChessmenMapsAreEquals(initialChessmenArrangement));
		});

		it("active cells aren't changed", () => {
			game.moveChessman("white-pawn", "d2", "d4");
			game.moveChessman("black-pawn", "d7", "d5");
			board.selectCell("e2");

			controls.performAction("flip-board");

			board.getFocusedCell().should(assertOptionalValueBox<BoardCoordinate>("d5"));
			board.getSelectedCell().should(assertOptionalValueBox<BoardCoordinate>("e2"));
		});
	});

	describe("board cell selection", () => {
		it("common success case", () => {
			const coordinate = "g5";

			board.selectCell(coordinate);
			board.getSelectedCell().should(assertOptionalValueBox<BoardCoordinate>(coordinate));
		});

		it("selection is clear after click to same cell", () => {
			const coordinate = "b3";

			board.selectCell(coordinate);
			board.getSelectedCell().should(assertOptionalValueBox<BoardCoordinate>(coordinate));

			board.selectCell(coordinate);
			board.getSelectedCell().should(assertOptionalValueBox<BoardCoordinate>(null));
		});
	});

	describe("move chessman", () => {
		function expectChessmanIsNotCaptured({
			sourceCoordinate,
			sourceChessman,
			destinationCoordinate,
			destinationChessman,
		}: {
			sourceCoordinate: BoardCoordinate;
			sourceChessman: Chessman;
			destinationCoordinate: BoardCoordinate;
			destinationChessman: Chessman;
		}) {
			board.getSelectedCell().should(assertOptionalValueBox<BoardCoordinate>(sourceCoordinate));
			board.getChessman(sourceCoordinate).should(assertOptionalValueBox<Chessman>(sourceChessman));
			board.getChessman(destinationCoordinate).should(assertOptionalValueBox<Chessman>(destinationChessman));
		}

		it("commom success case", () => {
			const sourceCoordinate = "e2";
			const destinationCoordinate = "e4";

			board.selectCell(sourceCoordinate);
			board.selectCell(destinationCoordinate);

			board.getChessman(sourceCoordinate).should(assertOptionalValueBox<Chessman>(null));
			board.getChessman(destinationCoordinate).should(assertOptionalValueBox<Chessman>("white-pawn"));
			board.getSelectedCell().should(assertOptionalValueBox<BoardCoordinate>(null));
			board.getFocusedCell().should(assertOptionalValueBox<BoardCoordinate>(destinationCoordinate));

			history.getItems().should("eql", ["moving:white-pawn:e2-e4"]);
		});

		it("can't capture a own chessman", () => {
			const sourceCoordinate = "b1";
			const destinationCoordinate = "d2";

			game.moveChessman("white-knight", sourceCoordinate, destinationCoordinate);

			expectChessmanIsNotCaptured({
				sourceCoordinate,
				destinationCoordinate,
				sourceChessman: "white-knight",
				destinationChessman: "white-pawn",
			});

			board.getFocusedCell().should(assertOptionalValueBox<BoardCoordinate>(null));
		});

		it("can't capture a King", () => {
			game.moveChessman("white-pawn", "c2", "c4");
			game.moveChessman("black-pawn", "d7", "d5");
			game.moveChessman("white-queen", "d1", "a4");
			game.moveChessman("black-pawn", "d5", "c4");

			const sourceCoordinate = "a4";
			const destinationCoordinate = "e8";

			game.moveChessman("white-queen", sourceCoordinate, destinationCoordinate);

			expectChessmanIsNotCaptured({
				sourceCoordinate,
				destinationCoordinate,
				sourceChessman: "white-queen",
				destinationChessman: "black-king",
			});

			board.getFocusedCell().should(assertOptionalValueBox<BoardCoordinate>("c4"));
		});
	});

	describe("add chessman", () => {
		function expectCorrectAvailableChessmen(excludedChessmen: Chessman[]) {
			addChessmanDialog.getChessmen().should((availableChessmen) => {
				expect(availableChessmen.length).equal(allChessmen.length - excludedChessmen.length);
				expect(availableChessmen).not.include.members(excludedChessmen);
			});
		}

		it("commom success case", () => {
			const coordinate = "e5";
			const chessman = "white-queen";

			board.selectCell(coordinate);
			controls.performAction("add-chessman");
			addChessmanDialog.select(chessman);

			addChessmanDialog.isVisible().should("equal", false);
			controls.isControlAvailable("add-chessman").should("equal", false);
			board.getChessman(coordinate).should(assertOptionalValueBox<Chessman>(chessman));
			board.getSelectedCell().should(assertOptionalValueBox<BoardCoordinate>(null));
			board.getFocusedCell().should(assertOptionalValueBox<BoardCoordinate>(coordinate));

			history.getItems().should("eql", ["adding:white-queen:e5"]);
		});

		it("add chessman action is disabled if cell isn't selected", () => {
			game.moveChessman("white-pawn", "a2", "a4");

			controls.isControlAvailable("add-chessman").should("equal", false);
		});

		it("add chessman action is disabled if cell isn't empty", () => {
			board.selectCell("h2");

			controls.isControlAvailable("add-chessman").should("equal", false);
		});

		it("can add all chessmen except Kings & Pawns", () => {
			board.selectCell("e4");
			controls.performAction("add-chessman");

			expectCorrectAvailableChessmen(["white-pawn", "black-pawn", "white-king", "black-king"]);
		});

		it("can add Pawn if they aren't all on board", () => {
			game.removeChessman("white-pawn", "e2");

			board.selectCell("e5");
			controls.performAction("add-chessman");

			expectCorrectAvailableChessmen(["black-pawn", "white-king", "black-king"]);
		});

		it("dialog closing on click to other area", () => {
			board.selectCell("a3");

			controls.performAction("add-chessman");
			addChessmanDialog.isVisible().should("equal", true);

			cy.get("body").click();

			addChessmanDialog.isVisible().should("equal", false);
		});
	});

	describe("remove chessman", () => {
		it("commom success case", () => {
			const coordinate = "a2";

			board.selectCell(coordinate);
			controls.performAction("remove-chessman");

			board.getSelectedCell().should(assertOptionalValueBox<BoardCoordinate>(null));
			board.getFocusedCell().should(assertOptionalValueBox<BoardCoordinate>(coordinate));
			board.getChessman(coordinate).should(assertOptionalValueBox<Chessman>(null));
			controls.isControlAvailable("remove-chessman").should("equal", false);

			history.getItems().should("eql", ["removing:white-pawn:a2"]);
		});

		it("can't remove a King", () => {
			board.selectCell("e8");
			controls.isControlAvailable("remove-chessman").should("equal", false);
		});

		it("remove action is disabled if cell isn't selected", () => {
			game.moveChessman("white-pawn", "e2", "e4");

			controls.isControlAvailable("remove-chessman").should("equal", false);
		});

		it("remove action is disabled if empty cell selected", () => {
			board.selectCell("h6");

			controls.isControlAvailable("remove-chessman").should("equal", false);
		});
	});

	it("new game on regular mode", () => {
		game.moveChessman("white-pawn", "e2", "e4");
		controls.performAction("new-game");

		controls.isControlAvailable("go-back").should("equal", false);
		controls.isControlAvailable("go-forward").should("equal", false);
		board.getChessmenMap().should(assertChessmenMapsAreEquals(initialChessmenArrangement));
		board.getSelectedCell().should(assertOptionalValueBox<BoardCoordinate>(null));
		board.getFocusedCell().should(assertOptionalValueBox<BoardCoordinate>(null));
		history.getItems().should("eql", []);

		sidebarTabs.goToTab("diff");
		chessmenDiff.getItems().should("eql", []);
	});

	it("new game on empty board mode", () => {
		game.moveChessman("white-pawn", "e2", "e4");

		controls.performAction("empty-board");
		controls.isControlAvailable("go-back").should("equal", false);
		controls.isControlAvailable("go-forward").should("equal", false);
		board.getChessmenMap().should(assertChessmenMapsAreEquals(new Map()));
		board.getSelectedCell().should(assertOptionalValueBox<BoardCoordinate>(null));
		board.getFocusedCell().should(assertOptionalValueBox<BoardCoordinate>(null));
		history.getItems().should("eql", []);

		sidebarTabs.goToTab("diff");
		chessmenDiff.getItems().should("eql", []);
	});

	describe("history", () => {
		it("can go back after first move", () => {
			game.moveChessman("white-pawn", "e2", "e4");

			controls.isControlAvailable("go-back").should("equal", true);
			controls.performAction("go-back");

			board.getChessmenMap().should(assertChessmenMapsAreEquals(initialChessmenArrangement));
			controls.isControlAvailable("go-back").should("equal", false);
		});

		it("can go forward after going back", () => {
			controls.performAction("empty-board");
			game.addChessman("white-king", "e1");

			controls.performAction("go-back");

			controls.isControlAvailable("go-forward").should("equal", true);
			controls.performAction("go-forward");
			controls.isControlAvailable("go-forward").should("equal", false);

			controls.performAction("go-back");
			board.getChessmenMap().should(assertChessmenMapsAreEquals(new Map()));
		});

		it("can't go forward if history rewritten", () => {
			game.moveChessman("white-pawn", "e2", "e4");
			game.moveChessman("black-pawn", "e7", "e5");
			game.moveChessman("white-knight", "g1", "f3");

			history.selectByIndex(0);
			controls.performAction("go-back");

			game.moveChessman("white-pawn", "e2", "e3");
			controls.isControlAvailable("go-forward").should("equal", false);
		});

		it("last history item is current by default", () => {
			game.moveChessman("white-pawn", "e2", "e4");
			game.moveChessman("black-pawn", "e7", "e5");
			game.moveChessman("white-knight", "g1", "f3");

			history.getCurrentItemIndex().should(assertOptionalValueBox<number>(2));
		});

		it("hasn't current item when is going to initial state", () => {
			game.moveChessman("white-pawn", "e2", "e4");
			game.moveChessman("black-pawn", "e7", "e5");
			game.moveChessman("white-knight", "g1", "f3");

			history.selectByIndex(0);
			controls.performAction("go-back");

			board.getChessmenMap().should(assertChessmenMapsAreEquals(initialChessmenArrangement));

			history.getCurrentItemIndex().should(assertOptionalValueBox<number>(null));
		});

		it("items are in correct state if history rewritten", () => {
			game.moveChessman("white-pawn", "e2", "e4");
			game.moveChessman("black-pawn", "d7", "d5");
			game.moveChessman("white-pawn", "e4", "d5");

			history.selectByIndex(0);
			game.moveChessman("black-pawn", "e7", "e5");

			history.getItems().should("eql", ["moving:black-pawn:e7-e5", "moving:white-pawn:e2-e4"]);

			history.getCurrentItemIndex().should(assertOptionalValueBox<number>(1));
		});
	});

	describe("chessmen diff", () => {
		beforeEach(() => {
			sidebarTabs.goToTab("diff");
		});

		it("no differences after simple movings", () => {
			game.moveChessman("white-pawn", "e2", "e4");
			game.moveChessman("black-pawn", "e7", "e5");
			game.moveChessman("white-knight", "g1", "f3");

			chessmenDiff.getItems().should("eql", []);
		});

		it("differences after moving with capture", () => {
			game.moveChessman("white-pawn", "e2", "e4");
			game.moveChessman("black-pawn", "d7", "d5");
			game.moveChessman("white-pawn", "e4", "d5");

			chessmenDiff.getItems().should("eql", ["white-pawn:1"]);
		});

		it("differences after adding", () => {
			controls.performAction("empty-board");

			game.addChessman("white-rook", "a1");

			chessmenDiff.getItems().should("eql", ["white-rook:1"]);
		});

		it("differences after removing", () => {
			game.removeChessman("black-knight", "b8");

			chessmenDiff.getItems().should("eql", ["white-knight:1"]);
		});

		it("no differences if to add same chessman for each color", () => {
			controls.performAction("empty-board");

			game.addChessman("white-pawn", "e2");
			game.addChessman("black-pawn", "e7");

			chessmenDiff.getItems().should("eql", []);
		});

		it("sync with history", () => {
			controls.performAction("empty-board");

			game.addChessman("white-pawn", "a2");
			game.addChessman("white-pawn", "b2");
			game.addChessman("white-pawn", "c2");
			game.addChessman("white-pawn", "d2");
			game.addChessman("white-pawn", "e2");
			game.addChessman("white-pawn", "f2");
			game.addChessman("white-pawn", "g2");
			game.addChessman("white-pawn", "h2");

			chessmenDiff.getItems().should("eql", ["white-pawn:8"]);

			sidebarTabs.goToTab("history");
			history.selectByIndex(1);
			sidebarTabs.goToTab("diff");

			chessmenDiff.getItems().should("eql", ["white-pawn:2"]);
		});
	});
});
