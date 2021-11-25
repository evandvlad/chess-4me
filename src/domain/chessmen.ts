import type { Coordinate } from "./board";

const chessmanPartsSeparator = "-";

export const chessmanColors = ["white", "black"] as const;
export const chessmanTypes = ["king", "queen", "rook", "bishop", "knight", "pawn"] as const;

export type ChessmanColor = typeof chessmanColors[number];

export type ChessmanType = typeof chessmanTypes[number];

interface ChessmanInfo {
	readonly color: ChessmanColor;
	readonly type: ChessmanType;
}

export type Chessman = `${ChessmanColor}${typeof chessmanPartsSeparator}${ChessmanType}`;
export type ChessmenMap = ReadonlyMap<Coordinate, Chessman>;

export const chessmen: ReadonlyArray<Chessman> = chessmanTypes.flatMap((type) =>
	chessmanColors.map<Chessman>((color) => getChessmanByInfo({ color, type })),
);

export function getChessmanInfo(chessman: Chessman): Readonly<ChessmanInfo> {
	const [color, type] = chessman.split(chessmanPartsSeparator) as [ChessmanColor, ChessmanType];
	return { color, type };
}

export function getChessmanByInfo({ color, type }: ChessmanInfo): Chessman {
	return `${color}${chessmanPartsSeparator}${type}`;
}

export function getOtherChessmanColor(color: ChessmanColor): ChessmanColor {
	return chessmanColors.filter((chessmanColor) => chessmanColor !== color)[0]!;
}

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
