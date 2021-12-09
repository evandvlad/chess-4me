import { type Coordinate } from "../board";
import { type ChessmenMap, type ChessmanColor, type Chessman, getChessmanByInfo } from "../chessmen";
import { analyzeCheck } from "../check-analyzer";

interface Parameters {
	readonly chessmenMap: ChessmenMap;
	readonly activeCoordinate: Coordinate | null;
	readonly lastActionColor: ChessmanColor | null;
}

export class BoardState {
	readonly chessmenMap: ChessmenMap;
	readonly activeCoordinate: Coordinate | null;
	readonly chessmanUnderCheck: Chessman | null;

	constructor({ chessmenMap, activeCoordinate, lastActionColor }: Parameters) {
		this.chessmenMap = chessmenMap;
		this.activeCoordinate = activeCoordinate;

		const checkForColor = lastActionColor ? analyzeCheck(chessmenMap, lastActionColor) : null;
		this.chessmanUnderCheck = checkForColor ? getChessmanByInfo({ color: checkForColor, type: "king" }) : null;
	}
}
