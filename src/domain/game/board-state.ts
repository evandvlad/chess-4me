import type { Coordinate } from "../board";
import type { ChessmenMap } from "../chessmen";

export class BoardState {
	constructor(readonly chessmenMap: ChessmenMap, readonly activeCoordinate: Coordinate | null = null) {}
}
