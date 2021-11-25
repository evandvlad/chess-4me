import { makeObservable, observable, action, computed } from "mobx";

import type { ChessmenMap, ChessmanColor, Chessman, ChessmanType } from "../chessmen";

import { getChessmanInfo, chessmanColors, chessmanTypes, getChessmanByInfo } from "../chessmen";

export interface ChessmenDiffItem {
	readonly chessman: Chessman;
	readonly num: number;
}

type ChessmenDiffDetails = ReadonlyMap<ChessmanColor, ReadonlyArray<ChessmenDiffItem>>;

type DiffValue = number;

class DiffValueCalculator {
	calculate(color: ChessmanColor, value: DiffValue = 0) {
		switch (color) {
			case "white":
				return value - 1;

			case "black":
				return value + 1;
		}
	}

	areEquals(value: DiffValue) {
		return value === 0;
	}

	getColor(value: DiffValue): ChessmanColor {
		return value > 0 ? "black" : "white";
	}

	toNum(value: DiffValue) {
		return Math.abs(value);
	}
}

export class ChessmenDiff {
	@observable.ref private chessmenMap: ChessmenMap;

	#diffValueCalculator = new DiffValueCalculator();

	constructor(chessmenMap: ChessmenMap) {
		makeObservable(this);
		this.chessmenMap = chessmenMap;
	}

	@computed.struct
	get details(): ChessmenDiffDetails {
		const diffMap = new Map<ChessmanType, DiffValue>();

		this.chessmenMap.forEach((chessman) => {
			const { type, color } = getChessmanInfo(chessman);

			const diffValue = this.#diffValueCalculator.calculate(color, diffMap.get(type));

			diffMap.set(type, diffValue);
		});

		const details = new Map<ChessmanColor, ChessmenDiffItem[]>(chessmanColors.map((color) => [color, []]));

		chessmanTypes.forEach((type) => {
			const diffValue = diffMap.get(type);

			if (typeof diffValue === "undefined" || this.#diffValueCalculator.areEquals(diffValue)) {
				return;
			}

			const color = this.#diffValueCalculator.getColor(diffValue);

			details.get(color)!.push({
				chessman: getChessmanByInfo({ color, type }),
				num: this.#diffValueCalculator.toNum(diffValue),
			});
		});

		return details;
	}

	@action
	updateChessmenMap(chessmenMap: ChessmenMap) {
		this.chessmenMap = chessmenMap;
	}
}
