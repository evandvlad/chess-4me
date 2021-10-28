import type { PositionOnScreen } from "../utils";
import type { BoardCoordinate, Chessman } from "../app-values";

import { comparePositionsOnScreens, forceTypify } from "../utils";
import { board, gameControls, app, addChessmanDialog } from "../app-components";
import { initialChessmenArrangement, allChessmen } from "../app-values";

describe("simple cases", () => {
	beforeEach(() => {
		cy.visit("");
	});

	it("initial state", () => {
		board.assertDirection("regular");
		board.assertSelectedCell(null);
		board.assertFocusedCell(null);

		app.assertChessmenArrangement(initialChessmenArrangement);

		gameControls.assertControlAvailability("new-game", false);
		gameControls.assertControlAvailability("flip-board");
		gameControls.assertControlAvailability("go-back", false);
		gameControls.assertControlAvailability("go-forward", false);
		gameControls.assertControlAvailability("add-chessman", false);
		gameControls.assertControlAvailability("remove-chessman", false);
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
		function expectChessmanIsNotBeaten({
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
		});

		it("can't beat a own chessman", () => {
			const sourceCoordinate = "b1";
			const destinationCoordinate = "d2";

			board.selectCell("b1");
			board.selectCell("d2");

			expectChessmanIsNotBeaten({
				sourceCoordinate,
				destinationCoordinate,
				sourceChessman: "white-knight",
				destinationChessman: "white-pawn",
			});

			board.assertFocusedCell(null);
		});

		it("can't beat a King", () => {
			app.moveChessman("white-pawn", "c2", "c4");
			app.moveChessman("black-pawn", "d7", "d5");
			app.moveChessman("white-queen", "d1", "a4");
			app.moveChessman("black-pawn", "d5", "c4");

			app.clearSelection();

			const sourceCoordinate = "a4";
			const destinationCoordinate = "e8";

			board.selectCell(sourceCoordinate);
			board.selectCell(destinationCoordinate);

			expectChessmanIsNotBeaten({
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
		});

		it("add chessman action is disabled if cell isn't selected", () => {
			app.moveChessman("white-pawn", "a2", "a4");
			app.clearSelection();

			gameControls.assertControlAvailability("add-chessman", false);
		});

		it("add chessman action is disabled if cell isn't empty", () => {
			board.selectCell("h2");

			gameControls.assertControlAvailability("add-chessman", false);
		});

		it("can add all chessmen except Kings & Pawns", () => {
			board.selectCell("e4");
			gameControls.performAction("add-chessman");

			expectCorrectAvailableChessmen(["white-pawn", "black-pawn", "white-king", "black-king"]);
		});

		it("can add Pawn if they aren't all on board", () => {
			app.removeChessman("white-pawn", "e2");

			board.selectCell("e5");
			gameControls.performAction("add-chessman");

			expectCorrectAvailableChessmen(["black-pawn", "white-king", "black-king"]);
		});

		it("dialog closing on click to other area", () => {
			board.selectCell("a3");

			gameControls.performAction("add-chessman");
			addChessmanDialog.assertVisibility();

			cy.get("body").click();

			addChessmanDialog.assertVisibility(false);
		});
	});

	describe("remove chessman", () => {
		it("commom success case", () => {
			app.removeChessman("white-pawn", "a2");
		});

		it("can't remove a King", () => {
			board.selectCell("e8");
			gameControls.assertControlAvailability("remove-chessman", false);
		});

		it("remove action is disabled if cell isn't selected", () => {
			app.moveChessman("white-pawn", "e2", "e4");
			app.clearSelection();

			gameControls.assertControlAvailability("remove-chessman", false);
		});

		it("remove action is disabled if empty cell selected", () => {
			board.selectCell("h6");

			gameControls.assertControlAvailability("remove-chessman", false);
		});
	});

	it("new game", () => {
		app.moveChessman("white-pawn", "e2", "e4");
		app.newGame();

		gameControls.assertControlAvailability("go-back", false);
		gameControls.assertControlAvailability("go-forward", false);
	});

	describe("go back/go forward", () => {
		it("can go back after first move", () => {
			app.moveChessman("white-pawn", "e2", "e4");

			gameControls.assertControlAvailability("go-back");
			gameControls.performAction("go-back");

			app.assertChessmenArrangement(initialChessmenArrangement);
			gameControls.assertControlAvailability("go-back", false);
		});

		it("can go forward after going back", () => {
			app.moveChessman("white-pawn", "e2", "e4");

			gameControls.performAction("go-back");

			gameControls.assertControlAvailability("go-forward");
			gameControls.performAction("go-forward");
			gameControls.assertControlAvailability("go-forward", false);

			gameControls.performAction("go-back");
			app.assertChessmenArrangement(initialChessmenArrangement);
		});

		it("can't go forward if history rewritten", () => {
			app.moveChessman("white-pawn", "e2", "e4");
			app.moveChessman("black-pawn", "e7", "e5");
			app.moveChessman("white-knight", "g1", "f3");

			gameControls.performAction("go-back");
			gameControls.performAction("go-back");
			gameControls.performAction("go-back");

			app.moveChessman("white-pawn", "e2", "e3");
			gameControls.assertControlAvailability("go-forward", false);
		});
	});
});
