type BoardRank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type BoardFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

const boardRanks: ReadonlyArray<BoardRank> = ["1", "2", "3", "4", "5", "6", "7", "8"];
const boardFiles: ReadonlyArray<BoardFile> = ["a", "b", "c", "d", "e", "f", "g", "h"];

export type BoardCoordinate = `${BoardFile}${BoardRank}`;

export const boardCoordinates: ReadonlyArray<BoardCoordinate> = boardFiles.flatMap((file) =>
	boardRanks.map<BoardCoordinate>((rank) => `${file}${rank}`),
);

export type Chessman = `${Color}-${ChessmanType}`;

export interface ChessmanInfo {
	readonly color: Color;
	readonly type: ChessmanType;
}

export type Color = "white" | "black";
export type ChessmanType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

export const chessmenArrangement: ReadonlyArray<readonly [BoardCoordinate, Chessman]> = [
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
	["e1", "white-king"],
	["f1", "white-bishop"],
	["g1", "white-knight"],
	["h1", "white-rook"],
	["a7", "black-pawn"],
	["b7", "black-pawn"],
	["c7", "black-pawn"],
	["d7", "black-pawn"],
	["e7", "black-pawn"],
	["f7", "black-pawn"],
	["g7", "black-pawn"],
	["h7", "black-pawn"],
	["a8", "black-rook"],
	["b8", "black-knight"],
	["c8", "black-bishop"],
	["d8", "black-queen"],
	["e8", "black-king"],
	["f8", "black-bishop"],
	["g8", "black-knight"],
	["h8", "black-rook"],
];

export function getChessmanInfo(chessman: Chessman): Readonly<ChessmanInfo> {
	const [color, type] = chessman.split("-") as [Color, ChessmanType];
	return { color, type };
}
