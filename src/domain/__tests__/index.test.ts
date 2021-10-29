import type { BoardCoordinate, Chessman } from "..";

import { Game, boardCoordinates } from "..";
import {
	expectChessmenArrangement,
	expectStateOfNewGameOnRegularMode,
	expectStateOfNewGameOnEmptyBoardMode,
	expectGameBoardStatesAreSame,
} from "./helpers";

describe("domain", () => {
	it("all board coordinates are unique", () => {
		const coordinatesSet = new Set(boardCoordinates);
		expect(boardCoordinates.length).to.equal(coordinatesSet.size);
	});

	it("new game on regular mode has correct state", () => {
		const game = Game.createOnRegularMode();
		expectStateOfNewGameOnRegularMode(game);
	});

	it("new game on empty board mode has correct state", () => {
		const game = Game.createOnEmptyBoardMode();
		expectStateOfNewGameOnEmptyBoardMode(game);
	});

	describe("available chessmen for adding", () => {
		it("both Kings aren't available for adding if they are on board", () => {
			const game = Game.createOnRegularMode();
			const kings = game.availableChessmenForAdding.filter(({ type }) => type === "king");

			expect(kings.length).to.equal(0);
		});

		it("King is available for adding if it isn't on board", () => {
			const game = Game.createOnEmptyBoardMode();
			game.addChessman("a1", { color: "white", type: "king" });

			const blackKingIsAvailable = game.availableChessmenForAdding.some(
				({ color, type }) => color === "black" && type === "king",
			);

			expect(blackKingIsAvailable).to.equal(true);
		});

		it("Pawns aren't available if all exists on board", () => {
			const game = Game.createOnRegularMode();
			const pawns = game.availableChessmenForAdding.filter(({ type }) => type === "pawn");

			expect(pawns.length).to.equal(0);
		});

		it("Pawn is available if their less than 8", () => {
			const game = Game.createOnRegularMode();

			game.removeChessman("e2");
			const pawns = game.availableChessmenForAdding.filter(({ type }) => type === "pawn");
			const whitePawn = pawns[0]!;

			expect(pawns.length).to.equal(1);
			expect(whitePawn.color).to.equal("white");
		});

		[
			{ color: "white", type: "rook" },
			{ color: "white", type: "knight" },
			{ color: "white", type: "bishop" },
			{ color: "white", type: "queen" },
			{ color: "black", type: "rook" },
			{ color: "black", type: "knight" },
			{ color: "black", type: "bishop" },
			{ color: "black", type: "queen" },
		].forEach(({ color, type }) => {
			it(`chessmen '${color}-${type}' is available for adding on new game (regular mode)`, () => {
				const game = Game.createOnRegularMode();
				const availableChessmen = game.availableChessmenForAdding;
				const isAvailableForAdding = availableChessmen.some(
					(chessman) => chessman.color === color && chessman.type === type,
				);

				expect(isAvailableForAdding).to.equal(true);
			});
		});

		[
			{ color: "white", type: "rook" },
			{ color: "white", type: "knight" },
			{ color: "white", type: "bishop" },
			{ color: "white", type: "queen" },
			{ color: "white", type: "pawn" },
			{ color: "white", type: "king" },
			{ color: "black", type: "rook" },
			{ color: "black", type: "knight" },
			{ color: "black", type: "bishop" },
			{ color: "black", type: "queen" },
			{ color: "black", type: "pawn" },
			{ color: "black", type: "king" },
		].forEach(({ color, type }) => {
			it(`chessmen '${color}-${type}' is available for adding on new game (empty board mode)`, () => {
				const game = Game.createOnEmptyBoardMode();
				const availableChessmen = game.availableChessmenForAdding;
				const isAvailableForAdding = availableChessmen.some(
					(chessman) => chessman.color === color && chessman.type === type,
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
			expectIncorrectAdding(Game.createOnRegularMode(), "e2", { color: "white", type: "rook" });
		});

		it("exception if chessman is not available for adding", () => {
			expectIncorrectAdding(Game.createOnRegularMode(), "e4", { color: "white", type: "king" });
		});

		it("adding chessman successfully", () => {
			const game = Game.createOnRegularMode();
			const chessman = game.availableChessmenForAdding[0]!;
			const coordinate = "d3";

			game.addChessman(coordinate, chessman);

			expectCorrectAdding(game, coordinate, chessman);
			expectChessmenArrangement({
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

		it("can't beat own chessman", () => {
			expectIncorrectMoving(Game.createOnRegularMode(), "b1", "d2");
		});

		it("can't beat a King", () => {
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
			expectChessmenArrangement({
				game,
				activeCoordinate: "e4",
				changeMap: new Map([
					["e2", null],
					["e4", { color: "white", type: "pawn" }],
				]),
			});
		});

		it("can beat not own chessman", () => {
			const game = Game.createOnRegularMode();

			game.moveChessman("e2", "e4");
			game.moveChessman("d7", "d5");

			expectCorrectMoving(game, "e4", "d5");
			expectChessmenArrangement({
				game,
				activeCoordinate: "d5",
				changeMap: new Map([
					["e2", null],
					["d7", null],
					["d5", { color: "white", type: "pawn" }],
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
				[{ color: "white", type: "king" }, "e1"],
				[{ color: "black", type: "king" }, "e8"],
			] as Array<[Chessman, BoardCoordinate]>
		).forEach(([chessman, coordinate]) => {
			it(`can't remove '${chessman.color}' King (regular mode of game)`, () => {
				const game = Game.createOnRegularMode();

				expectIncorrectRemoving(game, coordinate);
			});

			it(`can't remove '${chessman.color}' King also after adding (empty board mode of game)`, () => {
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
				expectChessmenArrangement({
					game,
					activeCoordinate: coordinate,
					changeMap: new Map([[coordinate, null]]),
				});
			});
		});
	});

	describe("history", () => {
		const simpleSingleActions: ReadonlyArray<[string, () => Game]> = [
			[
				"adding",
				() => {
					const game = Game.createOnRegularMode();
					game.addChessman("h3", { color: "white", type: "bishop" });
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

			game.addChessman("e2", { color: "white", type: "pawn" });
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

				expectChessmenArrangement({ game });
				expect(game.board.activeCoordinate).to.equal(null);
				expect(game.history.canGoBack).to.equal(false);
				expect(game.history.canGoForward).to.equal(true);
			});
		});

		it("correct state after go back & go forward", () => {
			const game1 = Game.createOnRegularMode();
			const game2 = Game.createOnRegularMode();

			game1.moveChessman("e2", "e4");
			game2.moveChessman("e2", "e4");

			game1.moveChessman("e7", "e5");
			game2.moveChessman("e7", "e5");

			game1.moveChessman("d2", "d3");
			game2.moveChessman("d2", "d3");

			game1.moveChessman("d7", "d6");
			game2.moveChessman("d7", "d6");

			game1.history.goBack();
			game1.history.goBack();
			game1.history.goForward();
			game1.history.goForward();

			expectGameBoardStatesAreSame(game1, game2);
		});
	});
});
