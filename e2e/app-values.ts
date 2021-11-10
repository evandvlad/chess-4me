type BoardRank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type BoardFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export type BoardCoordinate = `${BoardFile}${BoardRank}`;
export type ChessmenMap = Readonly<Map<BoardCoordinate, Chessman>>;

type Color = "white" | "black";
type ChessmanType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

export type Chessman = `${Color}-${ChessmanType}`;

export type GameControlName =
	| "empty-board"
	| "new-game"
	| "flip-board"
	| "go-back"
	| "go-forward"
	| "add-chessman"
	| "remove-chessman";

export type BoardDirection = "regular" | "flipped";

export const allChessmen: ReadonlyArray<Chessman> = [
	"white-pawn",
	"white-rook",
	"white-knight",
	"white-bishop",
	"white-queen",
	"white-king",
	"black-pawn",
	"black-rook",
	"black-knight",
	"black-bishop",
	"black-queen",
	"black-king",
];

export const initialChessmenArrangement: ChessmenMap = new Map([
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

export const boardCoordinates: ReadonlyArray<BoardCoordinate> = [
	"a1",
	"a2",
	"a3",
	"a4",
	"a5",
	"a6",
	"a7",
	"a8",
	"b1",
	"b2",
	"b3",
	"b4",
	"b5",
	"b6",
	"b7",
	"b8",
	"c1",
	"c2",
	"c3",
	"c4",
	"c5",
	"c6",
	"c7",
	"c8",
	"d1",
	"d2",
	"d3",
	"d4",
	"d5",
	"d6",
	"d7",
	"d8",
	"e1",
	"e2",
	"e3",
	"e4",
	"e5",
	"e6",
	"e7",
	"e8",
	"g1",
	"g2",
	"g3",
	"g4",
	"g5",
	"g6",
	"g7",
	"g8",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"h7",
	"h8",
];

export type HistoryItemValue =
	| `adding:${Chessman}:${BoardCoordinate}`
	| `removing:${Chessman}:${BoardCoordinate}`
	| `moving:${Chessman}:${BoardCoordinate}${"-" | "x"}${BoardCoordinate}`;

export interface HistoryItem {
	index: number;
	isCurrent: boolean;
	value: HistoryItemValue;
}

export type SidebarTabsTab = "history" | "diff";

export type ChessmenDiffItem = `${Chessman}:${number}`;
