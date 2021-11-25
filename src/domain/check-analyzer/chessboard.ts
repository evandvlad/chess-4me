import type { ChessmenMap, Chessman, ChessmanColor } from "../chessmen";
import type { Coordinate } from "../board";

import { getChessmanInfo } from "../chessmen";

export class Chessboard {
	readonly #chessmenCoordinates: ReadonlyMap<Chessman, ReadonlyArray<Coordinate>>;
	readonly #chessmenMap: ChessmenMap;

	constructor(chessmenMap: ChessmenMap) {
		this.#chessmenMap = chessmenMap;

		this.#chessmenCoordinates = Array.from(chessmenMap.entries()).reduce((map, [coordinate, chessman]) => {
			const positions = map.get(chessman) ?? [];

			positions.push(coordinate);
			map.set(chessman, positions);

			return map;
		}, new Map<Chessman, Coordinate[]>());
	}

	getChessmenTypesByColor(color: ChessmanColor) {
		const chessmenList = Array.from(this.#chessmenCoordinates.keys())
			.filter((chessman) => getChessmanInfo(chessman).color === color)
			.map((chessman) => getChessmanInfo(chessman).type);

		return new Set(chessmenList);
	}

	getCoordinatesOfChessman(chessman: Chessman): ReadonlyArray<Coordinate> {
		return this.#chessmenCoordinates.get(chessman) ?? [];
	}

	getChessmanByCoordinate(coordinate: Coordinate) {
		return this.#chessmenMap.get(coordinate);
	}
}
