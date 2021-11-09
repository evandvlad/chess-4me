import type { BoardCoordinate, Chessman } from "../chess-setup";
import type { ChessmenMap, BoardState, BoardClientAPI } from "./values";

export class Board implements BoardClientAPI {
	readonly activeCoordinate: BoardCoordinate | null;
	readonly chessmenMap: Readonly<ChessmenMap>;

	static createNew(chessmenMap: Readonly<ChessmenMap>): Board {
		return new this({ chessmenMap, activeCoordinate: null });
	}

	static createFromState(boardState: BoardState): Board {
		return new this(boardState);
	}

	private constructor({ chessmenMap, activeCoordinate }: BoardState) {
		this.chessmenMap = chessmenMap;
		this.activeCoordinate = activeCoordinate;
	}

	get state(): BoardState {
		return {
			activeCoordinate: this.activeCoordinate,
			chessmenMap: this.chessmenMap,
		};
	}

	getChessmanByCoordinate(coordinate: BoardCoordinate): Chessman | null {
		return this.chessmenMap.get(coordinate) ?? null;
	}

	hasChessmanByCoordinate(coordinate: BoardCoordinate): boolean {
		return this.getChessmanByCoordinate(coordinate) !== null;
	}

	getChessmanCount(chessman: Chessman): number {
		let count = 0;

		for (const chessmanInMap of this.chessmenMap.values()) {
			if (chessmanInMap === chessman) {
				count += 1;
			}
		}

		return count;
	}

	addChessman(coordinate: BoardCoordinate, chessman: Chessman): Board {
		const newChessmenMap = this.#copyChessmenMap();
		newChessmenMap.set(coordinate, chessman);

		return new Board({ chessmenMap: newChessmenMap, activeCoordinate: coordinate });
	}

	removeChessman(coordinate: BoardCoordinate): Board {
		const newChessmenMap = this.#copyChessmenMap();

		newChessmenMap.delete(coordinate);

		return new Board({ chessmenMap: newChessmenMap, activeCoordinate: coordinate });
	}

	#copyChessmenMap(): ChessmenMap {
		return new Map(this.chessmenMap.entries());
	}
}
