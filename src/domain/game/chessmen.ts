import type { Chessman, ChessmanColor, ChessmanType, BoardCoordinate } from "../chess-setup";

import { chessmenArrangement } from "../chess-setup";

class ChessmenRegistry {
	readonly #registry = new Map<`${ChessmanColor}/${ChessmanType}`, Chessman>();

	get(color: ChessmanColor, type: ChessmanType): Chessman {
		const key = this.#getKey(color, type);

		if (this.#registry.has(key)) {
			return this.#registry.get(key)!;
		}

		const chessman = {
			color,
			type,
		};

		this.#registry.set(key, chessman);

		return chessman;
	}

	#getKey(color: ChessmanColor, type: ChessmanType) {
		return `${color}/${type}` as const;
	}
}

export const chessmenRegistry = new ChessmenRegistry();

export function areChessmenEquals(chessman1: Chessman, chessman2: Chessman): boolean {
	return chessman1.color === chessman2.color && chessman1.type === chessman2.type;
}

export type ChessmenMap = Map<BoardCoordinate, Chessman>;

export const initialChessmenMap: ChessmenMap = new Map(
	chessmenArrangement.map(([coordinate, chessman]) => [
		coordinate,
		chessmenRegistry.get(chessman.color, chessman.type),
	]),
);
