import type { BoardCoordinate, Chessman } from "../chess-setup";
import type { ChessmenMap } from "./chessmen";
import type { HistoryRecord } from "./history";

import { areChessmenEquals } from "./chessmen";
import { assertTrue } from "~/utils/assert";

export interface BoardClientAPI {
	readonly activeCoordinate: BoardCoordinate | null;
	getChessmanByCoordinate: (coordinate: BoardCoordinate) => Chessman | null;
	hasChessmanByCoordinate: (coordinate: BoardCoordinate) => boolean;
}

export class Board implements BoardClientAPI {
	readonly activeCoordinate: BoardCoordinate | null;
	readonly chessmenMap: Readonly<ChessmenMap>;

	static createNew(chessmenMap: Readonly<ChessmenMap>): Board {
		return new this(chessmenMap, null);
	}

	static createFromHistoryRecord({ chessmenMap, activeCoordinate }: HistoryRecord): Board {
		return new this(chessmenMap, activeCoordinate);
	}

	private constructor(chessmenMap: Readonly<ChessmenMap>, activeCoordinate: BoardCoordinate | null) {
		this.chessmenMap = chessmenMap;
		this.activeCoordinate = activeCoordinate;
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
			if (areChessmenEquals(chessmanInMap, chessman)) {
				count += 1;
			}
		}

		return count;
	}

	moveChessman(sourceCoordinate: BoardCoordinate, destinationCoordinate: BoardCoordinate): Board {
		this.#assertChessmanByCoordinate(sourceCoordinate, true);

		const newChessmenMap = this.#copyChessmenMap();
		const chessman = newChessmenMap.get(sourceCoordinate)!;

		newChessmenMap.delete(sourceCoordinate);
		newChessmenMap.set(destinationCoordinate, chessman);

		return new Board(newChessmenMap, destinationCoordinate);
	}

	addChessman(coordinate: BoardCoordinate, chessman: Chessman): Board {
		this.#assertChessmanByCoordinate(coordinate, false);

		const newChessmenMap = this.#copyChessmenMap();
		newChessmenMap.set(coordinate, chessman);

		return new Board(newChessmenMap, coordinate);
	}

	removeChessman(coordinate: BoardCoordinate): Board {
		this.#assertChessmanByCoordinate(coordinate, true);

		const newChessmenMap = this.#copyChessmenMap();

		newChessmenMap.delete(coordinate);

		return new Board(newChessmenMap, coordinate);
	}

	#copyChessmenMap(): ChessmenMap {
		return new Map(this.chessmenMap.entries());
	}

	#assertChessmanByCoordinate(coordinate: BoardCoordinate, shouldExists: boolean): void {
		const hasChessman = this.chessmenMap.has(coordinate);

		assertTrue(
			shouldExists ? hasChessman : !hasChessman,
			`Chessman ${shouldExists ? "wasn't" : "was"} found on '${coordinate}'`,
		);
	}
}
