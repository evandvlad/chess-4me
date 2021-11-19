import type { BoardCoordinate, Chessman } from "..";

import { Game, boardCoordinates } from "..";
import {
	initialChessmenArrangement,
	ChessmenMapTuner,
	HistoryItemsTuner,
	expectCorrectBoardState,
	expectCorrectHistoryState,
	expectCorrectChessmenDiffState,
	expectCorrectNewGameState,
	expectCorrectGameStateAfterSingleAction,
} from "./helpers";

describe("domain", () => {
	it("all board coordinates are unique", () => {
		const coordinatesSet = new Set(boardCoordinates);
		expect(boardCoordinates.length).equal(coordinatesSet.size);
	});

	it("new game on regular mode has correct state", () => {
		const game = Game.createOnRegularMode();

		expectCorrectNewGameState(game, "regular");
	});

	it("new game on empty board mode has correct state", () => {
		const game = Game.createOnEmptyBoardMode();

		expectCorrectNewGameState(game, "empty board");
	});

	describe("available chessmen for adding", () => {
		function expectChessmanAvailabilityForAdding(game: Game, chessman: Chessman, isExpectedAsAvailable: boolean) {
			const availableChessmen = game.availableChessmenForAdding;
			const isAvailableForAdding = availableChessmen.some((availableChessman) => availableChessman === chessman);

			expect(isAvailableForAdding).equal(isExpectedAsAvailable);
		}

		it("both Kings aren't available for adding if they are on board", () => {
			const game = Game.createOnRegularMode();

			expectChessmanAvailabilityForAdding(game, "white-king", false);
			expectChessmanAvailabilityForAdding(game, "black-king", false);
		});

		it("King is available for adding if it isn't on board", () => {
			const game = Game.createOnEmptyBoardMode();

			game.addChessman("white-king", "a1");

			expectChessmanAvailabilityForAdding(game, "black-king", true);
		});

		it("Pawns aren't available if all exists on board", () => {
			const game = Game.createOnRegularMode();

			expectChessmanAvailabilityForAdding(game, "white-pawn", false);
			expectChessmanAvailabilityForAdding(game, "black-pawn", false);
		});

		it("Pawn is available if their less than 8", () => {
			const game = Game.createOnRegularMode();

			game.removeChessman("white-pawn", "e2");

			expectChessmanAvailabilityForAdding(game, "white-pawn", true);
		});

		(
			[
				"white-rook",
				"white-knight",
				"white-bishop",
				"white-queen",
				"black-rook",
				"black-knight",
				"black-bishop",
				"black-queen",
			] as Chessman[]
		).forEach((chessman) => {
			it(`chessman '${chessman}' is available for adding on new game (regular mode)`, () => {
				expectChessmanAvailabilityForAdding(Game.createOnRegularMode(), chessman, true);
			});
		});

		(
			[
				"white-rook",
				"white-knight",
				"white-bishop",
				"white-queen",
				"white-pawn",
				"white-king",
				"black-rook",
				"black-knight",
				"black-bishop",
				"black-queen",
				"black-pawn",
				"black-king",
			] as Chessman[]
		).forEach((chessman) => {
			it(`chessman '${chessman}' is available for adding on new game (empty board mode)`, () => {
				expectChessmanAvailabilityForAdding(Game.createOnEmptyBoardMode(), chessman, true);
			});
		});
	});

	describe("adding chessman", () => {
		const invariantErrorMessage = "Incorrect invariant for adding";

		it("exception if cell is not empty", () => {
			const game = Game.createOnRegularMode();

			expect(() => {
				game.addChessman("white-rook", "e2");
			}).throw(invariantErrorMessage);

			expectCorrectNewGameState(game, "regular");
		});

		it("exception if chessman is not available for adding", () => {
			const game = Game.createOnRegularMode();

			expect(() => {
				game.addChessman("white-king", "e4");
			}).throw(invariantErrorMessage);

			expectCorrectNewGameState(game, "regular");
		});

		it("adding chessman successfully", () => {
			const game = Game.createOnRegularMode();
			const chessman = game.availableChessmenForAdding[0]!;
			const coordinate = "d3";

			game.addChessman(chessman, coordinate);

			expectCorrectGameStateAfterSingleAction(game, {
				activeCoordinate: coordinate,
				chessmanMap: new ChessmenMapTuner(initialChessmenArrangement).set(coordinate, chessman).getMap(),
				historyItem: new HistoryItemsTuner().pushAddingAction(chessman, coordinate).getSingleItem(),
			});
		});
	});

	describe("moving chessman", () => {
		const invariantErrorMessage = "Incorrect invariant for moving";

		it("can't move if chessman isn't exists on source coordinate", () => {
			const game = Game.createOnRegularMode();
			const chessman = "white-pawn";
			const sourceCoordinate = "e4";
			const destinationCoordinate = "e5";

			const canMove = game.canMoveChessman(chessman, sourceCoordinate, destinationCoordinate);

			expect(canMove).equal(false);
			expect(() => {
				game.moveChessman(chessman, sourceCoordinate, destinationCoordinate);
			}).throw(invariantErrorMessage);

			expectCorrectNewGameState(game, "regular");
		});

		it("can't capture own chessman", () => {
			const game = Game.createOnRegularMode();
			const chessman = "white-knight";
			const sourceCoordinate = "b1";
			const destinationCoordinate = "d2";

			const canMove = game.canMoveChessman(chessman, sourceCoordinate, destinationCoordinate);

			expect(canMove).equal(false);
			expect(() => {
				game.moveChessman(chessman, sourceCoordinate, destinationCoordinate);
			}).throw(invariantErrorMessage);

			expectCorrectNewGameState(game, "regular");
		});

		it("can't capture a King", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("white-pawn", "d2", "d4");
			game.moveChessman("black-pawn", "e7", "e5");
			game.moveChessman("white-pawn", "d4", "e5");
			game.moveChessman("black-bishop", "f8", "b4");
			game.moveChessman("white-pawn", "e2", "e4");

			const chessman = "white-bishop";
			const sourceCoordinate = "b4";
			const destinationCoordinate = "e1";

			const canMove = game.canMoveChessman(chessman, sourceCoordinate, destinationCoordinate);

			expect(canMove).equal(false);
			expect(() => {
				game.moveChessman(chessman, sourceCoordinate, destinationCoordinate);
			}).throw(invariantErrorMessage);

			expectCorrectBoardState(game, {
				activeCoordinate: "e4",
				chessmenMap: new ChessmenMapTuner(initialChessmenArrangement)
					.remove("d2", "e2", "f8", "e7")
					.set("e4", "white-pawn")
					.set("e5", "white-pawn")
					.set("b4", "black-bishop")
					.getMap(),
			});
		});

		it("can move to empty cell", () => {
			const game = Game.createOnRegularMode();
			const chessman = "white-pawn";
			const sourceCoordinate = "e2";
			const destinationCoordinate = "e4";

			const canMove = game.canMoveChessman(chessman, sourceCoordinate, destinationCoordinate);
			game.moveChessman(chessman, sourceCoordinate, destinationCoordinate);

			expect(canMove).equal(true);
			expectCorrectGameStateAfterSingleAction(game, {
				chessmanMap: new ChessmenMapTuner(initialChessmenArrangement)
					.remove(sourceCoordinate)
					.set(destinationCoordinate, chessman)
					.getMap(),
				activeCoordinate: destinationCoordinate,
				historyItem: new HistoryItemsTuner()
					.pushMovingAction(chessman, sourceCoordinate, destinationCoordinate)
					.getSingleItem(),
			});
		});

		it("can capture not own chessman", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("white-pawn", "e2", "e4");
			game.moveChessman("black-pawn", "d7", "d5");

			const chessman = "white-pawn";
			const sourceCoordinate = "e4";
			const destinationCoordinate = "d5";

			const canMove = game.canMoveChessman(chessman, sourceCoordinate, destinationCoordinate);
			game.moveChessman(chessman, sourceCoordinate, destinationCoordinate);

			expect(canMove).equal(true);
			expectCorrectBoardState(game, {
				chessmenMap: new ChessmenMapTuner(initialChessmenArrangement)
					.remove("e2", "d7", sourceCoordinate)
					.set(destinationCoordinate, chessman)
					.getMap(),
				activeCoordinate: destinationCoordinate,
			});
		});
	});

	describe("removing chessman", () => {
		const invariantErrorMessage = "Incorrect invariant for removing";

		it("can't remove if chessman wasn't selected", () => {
			const game = Game.createOnRegularMode();
			const chessman = "white-pawn";
			const coordinate = "e4";

			const canRemove = game.canRemoveChessman(chessman, coordinate);

			expect(canRemove).equal(false);

			expect(() => {
				game.removeChessman(chessman, coordinate);
			}).throw(invariantErrorMessage);

			expectCorrectNewGameState(game, "regular");
		});

		(
			[
				["white-king", "e1"],
				["black-king", "e8"],
			] as Array<[Chessman, BoardCoordinate]>
		).forEach(([chessman, coordinate]) => {
			it(`can't remove '${chessman}' (regular mode of game)`, () => {
				const game = Game.createOnRegularMode();

				const canRemove = game.canRemoveChessman(chessman, coordinate);

				expect(canRemove).equal(false);

				expect(() => {
					game.removeChessman(chessman, coordinate);
				}).throw(invariantErrorMessage);

				expectCorrectNewGameState(game, "regular");
			});

			it(`can't remove '${chessman}' also after adding (empty board mode of game)`, () => {
				const game = Game.createOnEmptyBoardMode();
				game.addChessman(chessman, coordinate);

				const canRemove = game.canRemoveChessman(chessman, coordinate);

				expect(canRemove).equal(false);

				expect(() => {
					game.removeChessman(chessman, coordinate);
				}).throw(invariantErrorMessage);

				expectCorrectBoardState(game, {
					activeCoordinate: coordinate,
					chessmenMap: new ChessmenMapTuner().set(coordinate, chessman).getMap(),
				});
			});
		});

		(
			[
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
				["f1", "white-bishop"],
				["g1", "white-knight"],
				["h1", "white-rook"],
			] as Array<[BoardCoordinate, Chessman]>
		).forEach(([coordinate, chessman]) => {
			it(`can remove chessman '${chessman}' on '${coordinate}' on new game (regular mode)`, () => {
				const game = Game.createOnRegularMode();
				const canRemove = game.canRemoveChessman(chessman, coordinate);

				game.removeChessman(chessman, coordinate);

				expect(canRemove).equal(true);

				expectCorrectGameStateAfterSingleAction(game, {
					chessmanMap: new ChessmenMapTuner(initialChessmenArrangement).remove(coordinate).getMap(),
					activeCoordinate: coordinate,
					historyItem: new HistoryItemsTuner().pushRemovingAction(chessman, coordinate).getSingleItem(),
				});
			});
		});
	});

	describe("history", () => {
		it("can go forward after first action with going back (regular mode)", () => {
			const game = Game.createOnRegularMode();
			const chessman = "white-pawn";
			const sourceCoordinate = "e2";
			const destinationCoordinate = "e4";

			game.moveChessman(chessman, sourceCoordinate, destinationCoordinate);
			game.history.goBack();

			expectCorrectHistoryState(game, {
				currentIndex: undefined,
				canGoForward: true,
				canGoBack: false,
				items: new HistoryItemsTuner()
					.pushMovingAction(chessman, sourceCoordinate, destinationCoordinate)
					.getItems(),
			});

			expectCorrectBoardState(game, {
				activeCoordinate: null,
				chessmenMap: initialChessmenArrangement,
			});
		});

		it("can go forward after first action with going back (empty board mode)", () => {
			const game = Game.createOnEmptyBoardMode();
			const chessman = "white-pawn";
			const coordinate = "e2";

			game.addChessman(chessman, coordinate);
			game.history.goBack();

			expectCorrectHistoryState(game, {
				currentIndex: undefined,
				canGoForward: true,
				canGoBack: false,
				items: new HistoryItemsTuner().pushAddingAction(chessman, coordinate).getItems(),
			});

			expectCorrectBoardState(game, {
				activeCoordinate: null,
				chessmenMap: new Map(),
			});
		});

		it("forward steps resets after new action", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("white-pawn", "e2", "e4");
			game.moveChessman("black-pawn", "e7", "e5");
			game.moveChessman("white-pawn", "d2", "d3");
			game.moveChessman("black-pawn", "d7", "d6");

			game.history.goBack();
			game.moveChessman("black-pawn", "d7", "d5");
			game.moveChessman("white-pawn", "e4", "d5");

			expectCorrectHistoryState(game, {
				currentIndex: 4,
				canGoForward: false,
				canGoBack: true,
				items: new HistoryItemsTuner()
					.pushMovingAction("white-pawn", "e2", "e4")
					.pushMovingAction("black-pawn", "e7", "e5")
					.pushMovingAction("white-pawn", "d2", "d3")
					.pushMovingAction("black-pawn", "d7", "d5")
					.pushMovingAction("white-pawn", "e4", "d5", true)
					.getItems(),
			});

			expectCorrectBoardState(game, {
				activeCoordinate: "d5",
				chessmenMap: new ChessmenMapTuner(initialChessmenArrangement)
					.remove("e2", "d2", "e7", "d7")
					.set("d3", "white-pawn")
					.set("d5", "white-pawn")
					.set("e5", "black-pawn")
					.getMap(),
			});
		});

		it("correct state after go back & go forward", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("white-pawn", "e2", "e4");
			game.moveChessman("black-pawn", "e7", "e5");
			game.moveChessman("white-pawn", "d2", "d3");
			game.moveChessman("black-pawn", "d7", "d6");

			game.history.goBack();
			game.history.goBack();
			game.history.goForward();

			expectCorrectHistoryState(game, {
				currentIndex: 2,
				canGoForward: true,
				canGoBack: true,
				items: new HistoryItemsTuner()
					.pushMovingAction("white-pawn", "e2", "e4")
					.pushMovingAction("black-pawn", "e7", "e5")
					.pushMovingAction("white-pawn", "d2", "d3")
					.pushMovingAction("black-pawn", "d7", "d6")
					.getItems(),
			});

			expectCorrectBoardState(game, {
				activeCoordinate: "d3",
				chessmenMap: new ChessmenMapTuner(initialChessmenArrangement)
					.remove("e2", "e7", "d2")
					.set("e4", "white-pawn")
					.set("d3", "white-pawn")
					.set("e5", "black-pawn")
					.getMap(),
			});
		});

		[-1, 1, 100].forEach((index) => {
			it(`can't go by incorrect index '${index}'`, () => {
				const game = Game.createOnRegularMode();

				game.moveChessman("white-pawn", "e2", "e4");

				expect(() => {
					game.history.goByHistoryIndex(index);
				}).throw("Incorrect invariant for go by history index");
			});
		});

		it("can go by correct index", () => {
			const game = Game.createOnEmptyBoardMode();
			const chessman = "white-pawn";

			game.addChessman(chessman, "e2");
			game.moveChessman(chessman, "e2", "e4");
			game.moveChessman(chessman, "e4", "e5");
			game.moveChessman(chessman, "e5", "e6");
			game.removeChessman(chessman, "e6");

			game.history.goByHistoryIndex(0);

			expectCorrectHistoryState(game, {
				currentIndex: 0,
				canGoForward: true,
				canGoBack: true,
				items: new HistoryItemsTuner()
					.pushAddingAction(chessman, "e2")
					.pushMovingAction(chessman, "e2", "e4")
					.pushMovingAction(chessman, "e4", "e5")
					.pushMovingAction(chessman, "e5", "e6")
					.pushRemovingAction(chessman, "e6")
					.getItems(),
			});

			expectCorrectBoardState(game, {
				activeCoordinate: "e2",
				chessmenMap: new ChessmenMapTuner().set("e2", chessman).getMap(),
			});
		});

		[-1, 0].forEach((index) => {
			it(`current history index can't be '${index}' on new game`, () => {
				const game = Game.createOnEmptyBoardMode();

				expect(game.history.isCurrentHistoryIndex(index)).equal(false);
			});

			it(`current history index can't be '${index}' after first action & going back`, () => {
				const game = Game.createOnRegularMode();

				game.moveChessman("white-pawn", "e2", "e4");
				game.history.goBack();

				expect(game.history.isCurrentHistoryIndex(index)).equal(false);
			});
		});
	});

	describe("chessmen diff", () => {
		it("diff after adding action", () => {
			const game = Game.createOnEmptyBoardMode();
			const chessman = "white-king";

			game.addChessman(chessman, "a1");

			expectCorrectChessmenDiffState(game, [{ chessman, num: 1 }]);
		});

		it("diff after removing action", () => {
			const game = Game.createOnRegularMode();

			game.removeChessman("white-rook", "a1");

			expectCorrectChessmenDiffState(game, [{ chessman: "black-rook", num: 1 }]);
		});

		it("diff after moving with capture", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("white-pawn", "e2", "e4");
			game.moveChessman("black-pawn", "d7", "d5");
			game.moveChessman("white-pawn", "e4", "d5");

			expectCorrectChessmenDiffState(game, [{ chessman: "white-pawn", num: 1 }]);
		});

		it("several same chessmen in diff", () => {
			const game = Game.createOnEmptyBoardMode();
			const chessman = "white-pawn";

			game.addChessman(chessman, "a2");
			game.addChessman(chessman, "b2");
			game.addChessman(chessman, "c2");

			expectCorrectChessmenDiffState(game, [{ chessman, num: 3 }]);
		});

		it("several chessmen in diff for each color", () => {
			const game = Game.createOnEmptyBoardMode();

			game.addChessman("white-knight", "g5");
			game.addChessman("black-bishop", "b3");
			game.addChessman("white-knight", "c7");

			expectCorrectChessmenDiffState(game, [
				{ chessman: "white-knight", num: 2 },
				{ chessman: "black-bishop", num: 1 },
			]);
		});
	});
});
