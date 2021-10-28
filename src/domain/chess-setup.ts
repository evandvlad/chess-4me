type BoardRank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type BoardFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

const boardRanks: ReadonlyArray<BoardRank> = ["1", "2", "3", "4", "5", "6", "7", "8"];
const boardFiles: ReadonlyArray<BoardFile> = ["a", "b", "c", "d", "e", "f", "g", "h"];

export type BoardCoordinate = `${BoardFile}${BoardRank}`;

export const boardCoordinates: ReadonlyArray<BoardCoordinate> = boardFiles.flatMap((file) =>
	boardRanks.map<BoardCoordinate>((rank) => `${file}${rank}`),
);

export interface Chessman {
	readonly color: ChessmanColor;
	readonly type: ChessmanType;
}

export type ChessmanColor = "white" | "black";
export type ChessmanType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

export const chessmenArrangement: ReadonlyArray<readonly [BoardCoordinate, Chessman]> = [
	["a2", { color: "white", type: "pawn" }],
	["b2", { color: "white", type: "pawn" }],
	["c2", { color: "white", type: "pawn" }],
	["d2", { color: "white", type: "pawn" }],
	["e2", { color: "white", type: "pawn" }],
	["f2", { color: "white", type: "pawn" }],
	["g2", { color: "white", type: "pawn" }],
	["h2", { color: "white", type: "pawn" }],
	["a1", { color: "white", type: "rook" }],
	["b1", { color: "white", type: "knight" }],
	["c1", { color: "white", type: "bishop" }],
	["d1", { color: "white", type: "queen" }],
	["e1", { color: "white", type: "king" }],
	["f1", { color: "white", type: "bishop" }],
	["g1", { color: "white", type: "knight" }],
	["h1", { color: "white", type: "rook" }],
	["a7", { color: "black", type: "pawn" }],
	["b7", { color: "black", type: "pawn" }],
	["c7", { color: "black", type: "pawn" }],
	["d7", { color: "black", type: "pawn" }],
	["e7", { color: "black", type: "pawn" }],
	["f7", { color: "black", type: "pawn" }],
	["g7", { color: "black", type: "pawn" }],
	["h7", { color: "black", type: "pawn" }],
	["a8", { color: "black", type: "rook" }],
	["b8", { color: "black", type: "knight" }],
	["c8", { color: "black", type: "bishop" }],
	["d8", { color: "black", type: "queen" }],
	["e8", { color: "black", type: "king" }],
	["f8", { color: "black", type: "bishop" }],
	["g8", { color: "black", type: "knight" }],
	["h8", { color: "black", type: "rook" }],
];
