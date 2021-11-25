import type { OptionalValueBox, OptionalValue } from "./optional-value-box";
import type { ChessmenMap } from "../app-values";

import { boardCoordinates } from "../app-values";

export function assertOptionalValueBox<T>(expected: OptionalValue<T>) {
	return function <T>({ value }: OptionalValueBox<T>) {
		expect(value).eql(expected);
	};
}

export function assertChessmenMapsAreEquals(chessmenMap: ChessmenMap) {
	return function (expected: ChessmenMap) {
		const areEquals = boardCoordinates.every(
			(coordinate) => chessmenMap.get(coordinate) === expected.get(coordinate),
		);

		expect(areEquals).equal(true);
	};
}
