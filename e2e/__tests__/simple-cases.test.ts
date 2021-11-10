import type { PositionOnScreen } from "../utils/position-on-screen";
import type { BoardCoordinate, Chessman } from "../app-values";

import { comparePositionsOnScreens } from "../utils/position-on-screen";
import { forceTypify } from "../utils/force-typify";
import { board, controls, app, addChessmanDialog, history, sidebarTabs, chessmenDiff } from "../app-components";
import { initialChessmenArrangement, allChessmen } from "../app-values";

describe("simple cases", () => {
	beforeEach(() => {
		cy.visit("");
	});

	it("initial state", () => {
		board.assertDirection("regular");
		board.assertSelectedCell(null);
		board.assertFocusedCell(null);

		board.assertChessmenMap(initialChessmenArrangement);

		controls.assertControlAvailability("empty-board");
		controls.assertControlAvailability("new-game");
		controls.assertControlAvailability("flip-board");
		controls.assertControlAvailability("go-back", false);
		controls.assertControlAvailability("go-forward", false);
		controls.assertControlAvailability("add-chessman", false);
		controls.assertControlAvailability("remove-chessman", false);

		sidebarTabs.assertActiveTab("history");
		history.assertItems([]);
	});

	describe("flip board", () => {
		it("position on UI", function () {
			board.getCellPositionOnScreen("a1").as("a1onRegularBoard");
			board.getCellPositionOnScreen("h8").as("h8onRegularBoard");

			app.flipBoard();

			board.getCellPositionOnScreen("a1").as("a1onFlippedBoard");
			board.getCellPositionOnScreen("h8").as("h8onFlipperBoard");

			cy.wrap(
				forceTypify<{
					a1onRegularBoard: PositionOnScreen;
					h8onRegularBoard: PositionOnScreen;
					a1onFlippedBoard: PositionOnScreen;
					h8onFlipperBoard: PositionOnScreen;
				}>(this),
			).should(({ a1onRegularBoard, h8onRegularBoard, a1onFlippedBoard, h8onFlipperBoard }) => {
				expect(comparePositionsOnScreens(a1onRegularBoard, a1onFlippedBoard)).eql({ x: 1, y: -1 });
				expect(comparePositionsOnScreens(h8onRegularBoard, h8onFlipperBoard)).eql({ x: -1, y: 1 });
				expect(comparePositionsOnScreens(a1onRegularBoard, h8onFlipperBoard)).eql({ x: 0, y: 0 });
			});

			board.assertDirection("flipped");
		});

		it("chesmen arrangement isn't changed", () => {
			app.flipBoard();
			app.assertChessmenArrangement(initialChessmenArrangement);
		});

		it("active cells aren't changed", () => {
			app.moveChessman("white-pawn", "d2", "d4");
			app.moveChessman("black-pawn", "d7", "d5");
			board.selectCell("e2");

			app.flipBoard();

			board.assertFocusedCell("d5");
			board.assertSelectedCell("e2");
		});
	});

	describe("board cell selection", () => {
		it("common success case", () => {
			const coordinate = "g5";

			board.selectCell(coordinate);
			board.assertSelectedCell(coordinate);
		});

		it("selection is clear after click to same cell", () => {
			const coordinate = "b3";

			board.selectCell(coordinate);
			board.assertSelectedCell(coordinate);

			board.selectCell(coordinate);
			board.assertSelectedCell(null);
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
			board.assertSelectedCell(sourceCoordinate);
			board.assertChessman(sourceChessman, sourceCoordinate);
			board.assertChessman(destinationChessman, destinationCoordinate);
		}

		it("commom success case", () => {
			app.moveChessman("white-pawn", "e2", "e4");

			history.assertItems([
				{
					index: 0,
					isCurrent: true,
					value: "moving:white-pawn:e2-e4",
				},
			]);
		});

		it("can't capture a own chessman", () => {
			const sourceCoordinate = "b1";
			const destinationCoordinate = "d2";

			board.selectCell("b1");
			board.selectCell("d2");

			expectChessmanIsNotCaptured({
				sourceCoordinate,
				destinationCoordinate,
				sourceChessman: "white-knight",
				destinationChessman: "white-pawn",
			});

			board.assertFocusedCell(null);
		});

		it("can't capture a King", () => {
			app.moveChessman("white-pawn", "c2", "c4");
			app.moveChessman("black-pawn", "d7", "d5");
			app.moveChessman("white-queen", "d1", "a4");
			app.moveChessman("black-pawn", "d5", "c4");

			const sourceCoordinate = "a4";
			const destinationCoordinate = "e8";

			board.selectCell(sourceCoordinate);
			board.selectCell(destinationCoordinate);

			expectChessmanIsNotCaptured({
				sourceCoordinate,
				destinationCoordinate,
				sourceChessman: "white-queen",
				destinationChessman: "black-king",
			});

			board.assertFocusedCell("c4");
		});
	});

	describe("add chessman", () => {
		function expectCorrectAvailableChessmen(excludedChessmen: Chessman[]) {
			addChessmanDialog.getChessmen().should((availableChessmen) => {
				expect(availableChessmen.length).to.equal(allChessmen.length - excludedChessmen.length);
				expect(availableChessmen).not.to.include.members(excludedChessmen);
			});
		}

		it("commom success case", () => {
			app.addChessman("white-queen", "e5");

			history.assertItems([
				{
					index: 0,
					isCurrent: true,
					value: "adding:white-queen:e5",
				},
			]);
		});

		it("add chessman action is disabled if cell isn't selected", () => {
			app.moveChessman("white-pawn", "a2", "a4");

			controls.assertControlAvailability("add-chessman", false);
		});

		it("add chessman action is disabled if cell isn't empty", () => {
			board.selectCell("h2");

			controls.assertControlAvailability("add-chessman", false);
		});

		it("can add all chessmen except Kings & Pawns", () => {
			board.selectCell("e4");
			controls.performAction("add-chessman");

			expectCorrectAvailableChessmen(["white-pawn", "black-pawn", "white-king", "black-king"]);
		});

		it("can add Pawn if they aren't all on board", () => {
			app.removeChessman("white-pawn", "e2");

			board.selectCell("e5");
			controls.performAction("add-chessman");

			expectCorrectAvailableChessmen(["black-pawn", "white-king", "black-king"]);
		});

		it("dialog closing on click to other area", () => {
			board.selectCell("a3");

			controls.performAction("add-chessman");
			addChessmanDialog.assertVisibility();

			cy.get("body").click();

			addChessmanDialog.assertVisibility(false);
		});
	});

	describe("remove chessman", () => {
		it("commom success case", () => {
			app.removeChessman("white-pawn", "a2");

			history.assertItems([
				{
					index: 0,
					isCurrent: true,
					value: "removing:white-pawn:a2",
				},
			]);
		});

		it("can't remove a King", () => {
			board.selectCell("e8");
			controls.assertControlAvailability("remove-chessman", false);
		});

		it("remove action is disabled if cell isn't selected", () => {
			app.moveChessman("white-pawn", "e2", "e4");

			controls.assertControlAvailability("remove-chessman", false);
		});

		it("remove action is disabled if empty cell selected", () => {
			board.selectCell("h6");

			controls.assertControlAvailability("remove-chessman", false);
		});
	});

	it("new game on regular mode", () => {
		app.moveChessman("white-pawn", "e2", "e4");
		app.newGameOnRegularMode();

		controls.assertControlAvailability("go-back", false);
		controls.assertControlAvailability("go-forward", false);
	});

	it("new game on empty board mode", () => {
		app.moveChessman("white-pawn", "e2", "e4");
		app.newGameOnEmptyBoardMode();

		controls.assertControlAvailability("go-back", false);
		controls.assertControlAvailability("go-forward", false);
	});

	describe("history", () => {
		it("can go back after first move", () => {
			app.moveChessman("white-pawn", "e2", "e4");

			controls.assertControlAvailability("go-back");
			controls.performAction("go-back");

			app.assertChessmenArrangement(initialChessmenArrangement);
			controls.assertControlAvailability("go-back", false);
		});

		it("can go forward after going back", () => {
			app.newGameOnEmptyBoardMode();
			app.addChessman("white-king", "e1");

			controls.performAction("go-back");

			controls.assertControlAvailability("go-forward");
			controls.performAction("go-forward");
			controls.assertControlAvailability("go-forward", false);

			controls.performAction("go-back");
			app.assertChessmenArrangement(new Map());
		});

		it("can't go forward if history rewritten", () => {
			app.moveChessman("white-pawn", "e2", "e4");
			app.moveChessman("black-pawn", "e7", "e5");
			app.moveChessman("white-knight", "g1", "f3");

			history.selectByIndex(0);
			controls.performAction("go-back");

			app.moveChessman("white-pawn", "e2", "e3");
			controls.assertControlAvailability("go-forward", false);
		});

		it("last history item is current by default", () => {
			app.moveChessman("white-pawn", "e2", "e4");
			app.moveChessman("black-pawn", "e7", "e5");
			app.moveChessman("white-knight", "g1", "f3");

			history.assertCurrentItemIndex(2);
		});

		it("hasn't current item when is going to initial state", () => {
			app.moveChessman("white-pawn", "e2", "e4");
			app.moveChessman("black-pawn", "e7", "e5");
			app.moveChessman("white-knight", "g1", "f3");

			history.selectByIndex(0);
			controls.performAction("go-back");

			app.assertChessmenArrangement(initialChessmenArrangement);

			history.assertCurrentItemIndex(undefined);
		});

		it("items are in correct state if history rewritten", () => {
			app.moveChessman("white-pawn", "e2", "e4");
			app.moveChessman("black-pawn", "d7", "d5");
			app.moveChessman("white-pawn", "e4", "d5");

			history.selectByIndex(0);
			app.moveChessman("black-pawn", "e7", "e5");

			history.assertItems([
				{
					index: 1,
					isCurrent: true,
					value: "moving:black-pawn:e7-e5",
				},
				{
					index: 0,
					isCurrent: false,
					value: "moving:white-pawn:e2-e4",
				},
			]);
		});
	});

	describe("chessmen diff", () => {
		beforeEach(() => {
			sidebarTabs.goToTab("diff");
		});

		it("no differences after simple movings", () => {
			app.moveChessman("white-pawn", "e2", "e4");
			app.moveChessman("black-pawn", "e7", "e5");
			app.moveChessman("white-knight", "g1", "f3");

			chessmenDiff.assertItems([]);
		});

		it("differences after moving with capture", () => {
			app.moveChessman("white-pawn", "e2", "e4");
			app.moveChessman("black-pawn", "d7", "d5");
			app.moveChessman("white-pawn", "e4", "d5");

			chessmenDiff.assertItems(["white-pawn:1"]);
		});

		it("differences after adding", () => {
			app.newGameOnEmptyBoardMode("diff");

			app.addChessman("white-rook", "a1");

			chessmenDiff.assertItems(["white-rook:1"]);
		});

		it("differences after removing", () => {
			app.removeChessman("black-knight", "b8");

			chessmenDiff.assertItems(["white-knight:1"]);
		});

		it("no differences if to add same chessman for each color", () => {
			app.newGameOnEmptyBoardMode("diff");

			app.addChessman("white-pawn", "e2");
			app.addChessman("black-pawn", "e7");

			chessmenDiff.assertItems([]);
		});

		it("sync with history", () => {
			app.newGameOnEmptyBoardMode("diff");

			app.addChessman("white-pawn", "a2");
			app.addChessman("white-pawn", "b2");
			app.addChessman("white-pawn", "c2");
			app.addChessman("white-pawn", "d2");
			app.addChessman("white-pawn", "e2");
			app.addChessman("white-pawn", "f2");
			app.addChessman("white-pawn", "g2");
			app.addChessman("white-pawn", "h2");

			chessmenDiff.assertItems(["white-pawn:8"]);

			sidebarTabs.goToTab("history");
			app.goByHistoryIndex(1);
			sidebarTabs.goToTab("diff");

			chessmenDiff.assertItems(["white-pawn:2"]);
		});
	});
});
