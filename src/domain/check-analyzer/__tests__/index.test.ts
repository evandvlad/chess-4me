import type { ChessmenMap } from "../../chessmen";

import { analyzeCheck } from "..";

describe("check-analyzer", () => {
	it("not check for empty board", () => {
		const chessmenMap = new Map();

		expect(analyzeCheck(chessmenMap, "white")).equal(null);
	});

	it("not check for kings without other chessmen", () => {
		const chessmenMap: ChessmenMap = new Map([
			["h8", "black-king"],
			["h6", "white-king"],
		]);

		expect(analyzeCheck(chessmenMap, "white")).equal(null);
	});

	it("not check from on king to another", () => {
		const chessmenMap: ChessmenMap = new Map([
			["h8", "black-king"],
			["h7", "white-king"],
		]);

		expect(analyzeCheck(chessmenMap, "white")).equal(null);
	});

	it("not check when direct attacks are defends by own chessmen", () => {
		const chessmenMap: ChessmenMap = new Map([
			["g8", "black-king"],
			["f8", "black-rook"],
			["f7", "black-knight"],
			["g7", "black-pawn"],
			["h7", "black-pawn"],
			["e1", "white-king"],
			["g4", "white-queen"],
			["a2", "white-bishop"],
			["b8", "white-rook"],
		]);

		expect(analyzeCheck(chessmenMap, "white")).equal(null);
	});

	it("not check for chessmen which has different attack paths", () => {
		const chessmenMap: ChessmenMap = new Map([
			["e4", "white-king"],
			["f6", "black-king"],
			["d3", "black-pawn"],
			["e3", "black-pawn"],
			["a4", "black-knight"],
			["f2", "black-queen"],
			["g2", "black-rook"],
			["e6", "black-bishop"],
		]);

		expect(analyzeCheck(chessmenMap, "black")).equal(null);
	});

	it("check for side of last action has higher priority", () => {
		const chessmenMap1: ChessmenMap = new Map([
			["h1", "black-king"],
			["h3", "black-bishop"],
			["a8", "white-king"],
			["b7", "white-queen"],
		]);

		const chessmenMap2: ChessmenMap = new Map([
			["h1", "black-king"],
			["g2", "black-bishop"],
			["a8", "white-king"],
			["b7", "white-queen"],
		]);

		const chessmenMap3: ChessmenMap = new Map([
			["h1", "black-king"],
			["g2", "black-bishop"],
			["a8", "white-king"],
			["h7", "white-queen"],
		]);

		expect(analyzeCheck(chessmenMap1, "white")).equal("black");
		expect(analyzeCheck(chessmenMap2, "black")).equal(null);
		expect(analyzeCheck(chessmenMap3, "white")).equal("white");
	});

	it("check by pawn", () => {
		const chessmenMap: ChessmenMap = new Map([
			["g8", "black-king"],
			["f7", "black-pawn"],
			["e6", "white-king"],
		]);

		expect(analyzeCheck(chessmenMap, "white")).equal("white");
	});

	it("check by knight", () => {
		const chessmenMap: ChessmenMap = new Map([
			["g1", "white-king"],
			["f1", "white-rook"],
			["f2", "white-pawn"],
			["g2", "white-pawn"],
			["h2", "white-pawn"],
			["g8", "black-king"],
			["e2", "black-knight"],
		]);

		expect(analyzeCheck(chessmenMap, "black")).equal("white");
	});

	it("check by bishop", () => {
		const chessmenMap: ChessmenMap = new Map([
			["h8", "black-king"],
			["f7", "white-king"],
			["a1", "white-bishop"],
		]);

		expect(analyzeCheck(chessmenMap, "white")).equal("black");
	});

	it("check by rook", () => {
		const chessmenMap: ChessmenMap = new Map([
			["h8", "black-king"],
			["f7", "white-king"],
			["h1", "white-rook"],
		]);

		expect(analyzeCheck(chessmenMap, "white")).equal("black");
	});

	it("check by queen", () => {
		const chessmenMap: ChessmenMap = new Map([
			["h8", "black-king"],
			["f7", "white-king"],
			["a7", "black-queen"],
		]);

		expect(analyzeCheck(chessmenMap, "black")).equal("white");
	});
});
