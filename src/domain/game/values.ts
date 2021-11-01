import type { Chessman, BoardCoordinate } from "../chess-setup";

export type HistoryItem =
	| {
			readonly action: "adding";
			readonly chessman: Chessman;
			readonly coordinate: BoardCoordinate;
	  }
	| {
			readonly action: "removing";
			readonly chessman: Chessman;
			readonly coordinate: BoardCoordinate;
	  }
	| {
			readonly action: "moving";
			readonly chessman: Chessman;
			readonly sourceCoordinate: BoardCoordinate;
			readonly destinationCoordinate: BoardCoordinate;
			readonly isCapture: boolean;
	  };

export type ChessmenMap = Map<BoardCoordinate, Chessman>;

export interface BoardState {
	readonly activeCoordinate: BoardCoordinate | null;
	readonly chessmenMap: Readonly<ChessmenMap>;
}

export interface BoardClientAPI {
	readonly activeCoordinate: BoardCoordinate | null;
	getChessmanByCoordinate: (coordinate: BoardCoordinate) => Chessman | null;
	hasChessmanByCoordinate: (coordinate: BoardCoordinate) => boolean;
}

export interface HistoryClientAPI {
	readonly canGoBack: boolean;
	readonly canGoForward: boolean;
	readonly items: ReadonlyArray<HistoryItem>;
	goBack: () => void;
	goForward: () => void;
	goByHistoryIndex: (index: number) => void;
	isCurrentHistoryIndex: (index: number) => boolean;
}

export interface HistoryRecord {
	readonly item: HistoryItem;
	readonly boardState: BoardState;
}
