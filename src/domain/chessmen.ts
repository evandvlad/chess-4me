import type { Coordinate } from "./board";

export interface ChessmanInfo {
	readonly color: ChessmanColor;
	readonly type: ChessmanType;
}

export type ChessmanColor = "white" | "black";
export type ChessmanType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
export type Chessman = `${ChessmanColor}-${ChessmanType}`;
export type ChessmenMap = ReadonlyMap<Coordinate, Chessman>;

export const chessmanColors: ReadonlyArray<ChessmanColor> = ["white", "black"];
export const chessmanTypes: ReadonlyArray<ChessmanType> = ["king", "queen", "rook", "bishop", "knight", "pawn"];

export const chessmen: ReadonlyArray<Chessman> = chessmanTypes.flatMap((type) =>
	chessmanColors.map<Chessman>((color) => getChessmanByParams(color, type)),
);

export const chessmenArrangement: ChessmenMap = new Map([
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
]);

export function getChessmanInfo(chessman: Chessman): Readonly<ChessmanInfo> {
	const [color, type] = chessman.split("-") as [ChessmanColor, ChessmanType];
	return { color, type };
}

export function getChessmanByParams(color: ChessmanColor, type: ChessmanType): Chessman {
	return `${color}-${type}`;
}
