import type { BoardCoordinate, Chessman } from "..";

import { Game, boardCoordinates } from "..";
import { expectRegularGameChessmenArrangement, expectChessmanArrangement } from "./helpers";

describe("domain", () => {
	it("all board coordinates are unique", () => {
		const coordinatesSet = new Set(boardCoordinates);
		expect(boardCoordinates.length).to.equal(coordinatesSet.size);
	});

	it("new game on regular mode has correct state", () => {
		const game = Game.createOnRegularMode();

		expectRegularGameChessmenArrangement({ game });
		expect(game.history.canGoBack).to.equal(false);
	});

	it("new game on empty board mode has correct state", () => {
		const game = Game.createOnEmptyBoardMode();

		expectChessmanArrangement({ game, chessmenMap: new Map() });
		expect(game.history.canGoBack).to.equal(false);
	});

	describe("available chessmen for adding", () => {
		it("both Kings aren't available for adding if they are on board", () => {
			const game = Game.createOnRegularMode();
			const kings = ["white-king", "black-king"];
			const chessmen = game.availableChessmenForAdding.filter((chessman) => kings.includes(chessman));

			expect(chessmen.length).to.equal(0);
		});

		it("King is available for adding if it isn't on board", () => {
			const game = Game.createOnEmptyBoardMode();
			game.addChessman("a1", "white-king");

			const blackKingIsAvailable = game.availableChessmenForAdding.some((chessman) => chessman === "black-king");

			expect(blackKingIsAvailable).to.equal(true);
		});

		it("Pawns aren't available if all exists on board", () => {
			const game = Game.createOnRegularMode();
			const pawns = ["white-pawn", "black-pawn"];
			const chessmen = game.availableChessmenForAdding.filter((chessman) => pawns.includes(chessman));

			expect(chessmen.length).to.equal(0);
		});

		it("Pawn is available if their less than 8", () => {
			const game = Game.createOnRegularMode();

			game.removeChessman("e2");
			const pawns = game.availableChessmenForAdding.filter((chessman) => chessman === "white-pawn");

			expect(pawns.length).to.equal(1);
		});

		[
			"white-rook",
			"white-knight",
			"white-bishop",
			"white-queen",
			"black-rook",
			"black-knight",
			"black-bishop",
			"black-queen",
		].forEach((chessman) => {
			it(`chessman '${chessman}' is available for adding on new game (regular mode)`, () => {
				const game = Game.createOnRegularMode();
				const availableChessmen = game.availableChessmenForAdding;
				const isAvailableForAdding = availableChessmen.some(
					(availableChessman) => availableChessman === chessman,
				);

				expect(isAvailableForAdding).to.equal(true);
			});
		});

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
		].forEach((chessman) => {
			it(`chessman '${chessman}' is available for adding on new game (empty board mode)`, () => {
				const game = Game.createOnEmptyBoardMode();
				const availableChessmen = game.availableChessmenForAdding;
				const isAvailableForAdding = availableChessmen.some(
					(availableChessman) => availableChessman === chessman,
				);

				expect(isAvailableForAdding).to.equal(true);
			});
		});
	});

	describe("add chessman", () => {
		function expectIncorrectAdding(game: Game, coordinate: BoardCoordinate, chessman: Chessman) {
			expect(() => {
				game.addChessman(coordinate, chessman);
			}).to.throw("Incorrect invariant for adding");
		}

		function expectCorrectAdding(game: Game, coordinate: BoardCoordinate, chessman: Chessman) {
			expect(game.board.getChessmanByCoordinate(coordinate)).to.eql(chessman);
			expect(game.board.activeCoordinate).to.equal(coordinate);
		}

		it("exception if cell is not empty", () => {
			expectIncorrectAdding(Game.createOnRegularMode(), "e2", "white-rook");
		});

		it("exception if chessman is not available for adding", () => {
			expectIncorrectAdding(Game.createOnRegularMode(), "e4", "white-king");
		});

		it("adding chessman successfully", () => {
			const game = Game.createOnRegularMode();
			const chessman = game.availableChessmenForAdding[0]!;
			const coordinate = "d3";

			game.addChessman(coordinate, chessman);

			expectCorrectAdding(game, coordinate, chessman);
			expectRegularGameChessmenArrangement({
				game,
				activeCoordinate: coordinate,
				changeMap: new Map([[coordinate, chessman]]),
			});
		});
	});

	describe("can move/move chessman", () => {
		function expectIncorrectMoving(
			game: Game,
			sourceCoordinate: BoardCoordinate,
			destinationCoordinate: BoardCoordinate,
		) {
			expect(game.canMoveChessman(sourceCoordinate, destinationCoordinate)).to.equal(false);
			expect(() => {
				game.moveChessman(sourceCoordinate, destinationCoordinate);
			}).to.throw("Incorrect invariant for moving");
		}

		function expectCorrectMoving(
			game: Game,
			sourceCoordinate: BoardCoordinate,
			destinationCoordinate: BoardCoordinate,
		) {
			expect(game.canMoveChessman(sourceCoordinate, destinationCoordinate)).to.equal(true);

			game.moveChessman(sourceCoordinate, destinationCoordinate);

			expect(game.board.hasChessmanByCoordinate(sourceCoordinate)).to.equal(false);
			expect(game.board.hasChessmanByCoordinate(destinationCoordinate)).to.equal(true);
			expect(game.board.activeCoordinate).to.equal(destinationCoordinate);
		}

		it("can't move if chessman wasn't selected", () => {
			expectIncorrectMoving(Game.createOnRegularMode(), "e4", "e5");
		});

		it("can't capture own chessman", () => {
			expectIncorrectMoving(Game.createOnRegularMode(), "b1", "d2");
		});

		it("can't capture a King", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("d2", "d4");
			game.moveChessman("e7", "e5");
			game.moveChessman("d4", "e5");
			game.moveChessman("f8", "b4");
			game.moveChessman("e2", "e4");

			expectIncorrectMoving(game, "b4", "e1");
		});

		it("can move to empty cell", () => {
			const game = Game.createOnRegularMode();

			expectCorrectMoving(game, "e2", "e4");
			expectRegularGameChessmenArrangement({
				game,
				activeCoordinate: "e4",
				changeMap: new Map([
					["e2", null],
					["e4", "white-pawn"],
				]),
			});
		});

		it("can capture not own chessman", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("e2", "e4");
			game.moveChessman("d7", "d5");

			expectCorrectMoving(game, "e4", "d5");
			expectRegularGameChessmenArrangement({
				game,
				activeCoordinate: "d5",
				changeMap: new Map([
					["e2", null],
					["d7", null],
					["d5", "white-pawn"],
				]),
			});
		});
	});

	describe("can remove/remove chessman", () => {
		function expectIncorrectRemoving(game: Game, coordinate: BoardCoordinate) {
			expect(game.canRemoveChessman(coordinate)).to.equal(false);
			expect(() => {
				game.removeChessman(coordinate);
			}).to.throw("Incorrect invariant for removing");
		}

		function expectCorrectRemoving(game: Game, coordinate: BoardCoordinate) {
			expect(game.canRemoveChessman(coordinate)).to.equal(true);

			game.removeChessman(coordinate);

			expect(game.board.hasChessmanByCoordinate(coordinate)).to.equal(false);
			expect(game.board.activeCoordinate).to.equal(coordinate);
		}

		it("can't remove if chessman wasn't selected", () => {
			expectIncorrectRemoving(Game.createOnRegularMode(), "e4");
		});

		(
			[
				["white-king", "e1"],
				["black-king", "e8"],
			] as Array<[Chessman, BoardCoordinate]>
		).forEach(([chessman, coordinate]) => {
			it(`can't remove '${chessman}' (regular mode of game)`, () => {
				const game = Game.createOnRegularMode();

				expectIncorrectRemoving(game, coordinate);
			});

			it(`can't remove '${chessman}' also after adding (empty board mode of game)`, () => {
				const game = Game.createOnEmptyBoardMode();
				game.addChessman(coordinate, chessman);

				expectIncorrectRemoving(game, coordinate);
			});
		});

		(
			[
				"a2",
				"b2",
				"c2",
				"d2",
				"e2",
				"f2",
				"g2",
				"h2",
				"a1",
				"b1",
				"c1",
				"d1",
				"f1",
				"g1",
				"h1",
			] as BoardCoordinate[]
		).forEach((coordinate) => {
			it(`can remove chessman on '${coordinate}' on new game (regular mode)`, () => {
				const game = Game.createOnRegularMode();

				expectCorrectRemoving(game, coordinate);
				expectRegularGameChessmenArrangement({
					game,
					activeCoordinate: coordinate,
					changeMap: new Map([[coordinate, null]]),
				});
			});
		});
	});

	describe("history index & movements", () => {
		const simpleSingleActions: ReadonlyArray<[string, () => Game]> = [
			[
				"adding",
				() => {
					const game = Game.createOnRegularMode();
					game.addChessman("h3", "white-bishop");
					return game;
				},
			],
			[
				"moving",
				() => {
					const game = Game.createOnRegularMode();
					game.moveChessman("e2", "e4");
					return game;
				},
			],
			[
				"removing",
				() => {
					const game = Game.createOnRegularMode();
					game.removeChessman("a2");
					return game;
				},
			],
		];

		[
			["regular mode", Game.createOnRegularMode()] as const,
			["empty board mode", Game.createOnEmptyBoardMode()] as const,
		].forEach(([modeLabel, game]) => {
			it(`can't go back or forward on new game (${modeLabel})`, () => {
				expect(game.history.canGoBack).to.equal(false);
				expect(game.history.canGoForward).to.equal(false);
			});
		});

		simpleSingleActions.forEach(([name, action]) => {
			it(`can go back after first '${name}' action`, () => {
				const game = action();

				expect(game.history.canGoBack).to.equal(true);
			});

			it(`history index is moved after first '${name}' action`, () => {
				const game = action();

				expect(game.history.isCurrentHistoryIndex(0)).to.equal(true);
			});
		});

		it("can't go forward after first action", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("e2", "e4");

			expect(game.history.canGoForward).to.equal(false);
		});

		it("can go forward after first action & going back (regular mode)", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("e2", "e4");
			game.history.goBack();

			expect(game.history.canGoForward).to.equal(true);
		});

		it("can go forward after first action & going back (empty board mode)", () => {
			const game = Game.createOnEmptyBoardMode();

			game.addChessman("e2", "white-pawn");
			game.history.goBack();

			expect(game.history.canGoForward).to.equal(true);
		});

		it("forward steps resets after new action", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("e2", "e4");
			game.moveChessman("e7", "e5");
			game.moveChessman("d2", "d3");
			game.moveChessman("d7", "d6");

			game.history.goBack();
			game.moveChessman("d7", "d5");

			expect(game.history.canGoForward).to.equal(false);
		});

		simpleSingleActions.forEach(([name, action]) => {
			it(`go back after first '${name}' action translate state to new game (regular mode)`, () => {
				const game = action();

				game.history.goBack();

				expectRegularGameChessmenArrangement({ game });
				expect(game.board.activeCoordinate).to.equal(null);
				expect(game.history.canGoBack).to.equal(false);
				expect(game.history.canGoForward).to.equal(true);
			});
		});

		it("correct state after go back & go forward", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("e2", "e4");
			game.moveChessman("e7", "e5");
			game.moveChessman("d2", "d3");
			game.moveChessman("d7", "d6");

			game.history.goBack();
			game.history.goBack();
			game.history.goForward();
			game.history.goForward();

			expectRegularGameChessmenArrangement({
				game,
				changeMap: new Map([
					["e2", null],
					["e4", "white-pawn"],
					["d2", null],
					["d3", "white-pawn"],
					["e7", null],
					["e5", "black-pawn"],
					["d7", null],
					["d6", "black-pawn"],
				]),
				activeCoordinate: "d6",
			});

			expect(game.history.isCurrentHistoryIndex(3)).to.equal(true);
		});

		[-1, 1, 100].forEach((index) => {
			it(`can't go by incorrect index '${index}'`, () => {
				const game = Game.createOnRegularMode();

				game.moveChessman("e2", "e4");

				expect(() => {
					game.history.goByHistoryIndex(index);
				}).to.throw("Incorrect invariant for go by history index");
			});
		});

		it("can go by correct index", () => {
			const game = Game.createOnEmptyBoardMode();

			game.addChessman("e2", "white-pawn");
			game.moveChessman("e2", "e4");
			game.moveChessman("e4", "e5");
			game.moveChessman("e5", "e6");

			game.history.goByHistoryIndex(0);

			expect(game.history.isCurrentHistoryIndex(0)).to.equal(true);
			expectChessmanArrangement({ game, chessmenMap: new Map([["e2", "white-pawn"]]), activeCoordinate: "e2" });
		});

		[-1, 0].forEach((index) => {
			it(`current history index can't be '${index}' on new game`, () => {
				const game = Game.createOnEmptyBoardMode();

				expect(game.history.isCurrentHistoryIndex(index)).to.equal(false);
			});

			it(`current history index can't be '${index}' after first action & going back`, () => {
				const game = Game.createOnRegularMode();

				game.moveChessman("e2", "e4");
				game.history.goBack();

				expect(game.history.isCurrentHistoryIndex(index)).to.equal(false);
			});
		});
	});

	describe("history items", () => {
		it("empty on new game", () => {
			const game = Game.createOnRegularMode();

			expect(game.history.items.length).to.equal(0);
		});

		it("correct items after adding chessman", () => {
			const game = Game.createOnRegularMode();

			game.addChessman("e3", "white-rook");

			const item = game.history.items[0]!;

			expect(game.history.items.length).to.equal(1);

			expect(item).to.eql({
				action: "adding",
				chessman: "white-rook",
				coordinate: "e3",
			});

			expectRegularGameChessmenArrangement({
				game,
				changeMap: new Map([["e3", "white-rook"]]),
				activeCoordinate: "e3",
			});

			expect(game.history.isCurrentHistoryIndex(0)).to.equal(true);
		});

		it("correct items after removing chessman", () => {
			const game = Game.createOnRegularMode();

			game.removeChessman("a2");

			const item = game.history.items[0]!;

			expect(game.history.items.length).to.equal(1);

			expect(item).to.eql({
				action: "removing",
				chessman: "white-pawn",
				coordinate: "a2",
			});

			expectRegularGameChessmenArrangement({ game, changeMap: new Map([["a2", null]]), activeCoordinate: "a2" });
			expect(game.history.isCurrentHistoryIndex(0)).to.equal(true);
		});

		it("correct items after moving chessman", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("e2", "e4");

			const item = game.history.items[0]!;

			expect(game.history.items.length).to.equal(1);

			expect(item).to.eql({
				action: "moving",
				chessman: "white-pawn",
				sourceCoordinate: "e2",
				destinationCoordinate: "e4",
				isCapture: false,
			});

			expectRegularGameChessmenArrangement({
				game,
				changeMap: new Map([
					["e2", null],
					["e4", "white-pawn"],
				]),
				activeCoordinate: "e4",
			});

			expect(game.history.isCurrentHistoryIndex(0)).to.equal(true);
		});

		it("correct items after several moving actions", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("e2", "e4");
			game.moveChessman("d7", "d5");
			game.moveChessman("e4", "d5");

			const item = game.history.items[2]!;

			expect(game.history.items.length).to.equal(3);

			expect(item).to.eql({
				action: "moving",
				chessman: "white-pawn",
				sourceCoordinate: "e4",
				destinationCoordinate: "d5",
				isCapture: true,
			});

			expectRegularGameChessmenArrangement({
				game,
				changeMap: new Map([
					["e2", null],
					["d7", null],
					["d5", "white-pawn"],
				]),
				activeCoordinate: "d5",
			});

			expect(game.history.isCurrentHistoryIndex(2)).to.equal(true);
		});

		it("items aren't changed after go back/forward by history", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("e2", "e4");
			game.moveChessman("d7", "d5");

			const itemsCount = game.history.items.length;

			game.history.goBack();
			game.history.goBack();
			game.history.goForward();

			expect(game.history.items.length).to.equal(itemsCount);
			expect(game.history.isCurrentHistoryIndex(0)).to.equal(true);
		});

		it("items aren't changed after go by index", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("e2", "e4");
			game.moveChessman("d7", "d5");

			const itemsCount = game.history.items.length;

			game.history.goByHistoryIndex(0);

			expect(game.history.items.length).to.equal(itemsCount);
			expect(game.history.isCurrentHistoryIndex(0)).to.equal(true);
		});

		it("items are changed after go back/forward by history with replacement", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("e2", "e4");
			game.moveChessman("d7", "d5");
			game.moveChessman("e4", "d5");

			game.history.goBack();
			game.history.goBack();
			game.moveChessman("e7", "e5");

			const { items } = game.history;

			expect(items.length).to.equal(2);

			expect(items[0]!).to.eql({
				action: "moving",
				chessman: "white-pawn",
				sourceCoordinate: "e2",
				destinationCoordinate: "e4",
				isCapture: false,
			});

			expect(items[1]!).to.eql({
				action: "moving",
				chessman: "black-pawn",
				sourceCoordinate: "e7",
				destinationCoordinate: "e5",
				isCapture: false,
			});

			expect(game.history.isCurrentHistoryIndex(1)).to.equal(true);
		});
	});
});
