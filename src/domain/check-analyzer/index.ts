import type { ChessmenMap, Chessman, ChessmanColor, ChessmanType } from "../chessmen";
import type { Path } from "../board";
import type { ScanDirection, ScanStep } from "./board-scanner";

import { getOtherChessmanColor, getChessmanByInfo, getChessmanInfo, chessmanColors } from "../chessmen";
import { Chessboard } from "./chessboard";
import { BoardScanner } from "./board-scanner";

const pawnAttackPaths: Record<ChessmanColor, ReadonlyArray<Path>> = {
	white: ["-1/-1", "1/-1"],
	black: ["-1/1", "1/1"],
};

const knightAttackPaths: ReadonlyArray<Path> = ["-2/-1", "-2/1", "-1/-2", "-1/2", "1/-2", "1/2", "2/-1", "2/1"];
const bishopAttackPaths: ReadonlyArray<Path> = chessmanColors.flatMap((color) => pawnAttackPaths[color]);
const rookAttackPaths: ReadonlyArray<Path> = ["-1/0", "0/-1", "0/1", "1/0"];
const queenAttackPaths: ReadonlyArray<Path> = [...bishopAttackPaths, ...rookAttackPaths];

function createScannerDirections(paths: ReadonlyArray<Path>, iterateOnce: boolean): ScanDirection[] {
	return paths.map((path) => ({ path, iterateOnce }));
}

function collectScannerDirections(enemyColor: ChessmanColor, enemyChessmenTypes: ReadonlySet<ChessmanType>) {
	const chessmenTypes = new Set(enemyChessmenTypes);
	const directions: ScanDirection[] = [];

	chessmenTypes.delete("king");

	if (chessmenTypes.has("knight")) {
		directions.push(...createScannerDirections(knightAttackPaths, true));

		if (chessmenTypes.size === 1) {
			return directions;
		}

		chessmenTypes.delete("knight");
	}

	if (chessmenTypes.size === 1 && chessmenTypes.has("pawn")) {
		directions.push(...createScannerDirections(pawnAttackPaths[enemyColor], true));
		return directions;
	}

	const restPaths = Array.from(chessmenTypes).flatMap((type) => {
		switch (type) {
			case "pawn":
				return pawnAttackPaths[enemyColor];

			case "bishop":
				return bishopAttackPaths;

			case "rook":
				return rookAttackPaths;

			case "queen":
				return queenAttackPaths;

			default:
				return [];
		}
	});

	directions.push(...createScannerDirections([...new Set(restPaths)], false));

	return directions;
}

function hasCheckByChessman(scanStep: ScanStep, chessman: Chessman) {
	const { type, color } = getChessmanInfo(chessman);
	const { iterations } = scanStep;
	const { path } = scanStep.direction;

	switch (type) {
		case "pawn":
			return iterations === 1 && pawnAttackPaths[color].includes(path);

		case "knight":
			return iterations === 1 && knightAttackPaths.includes(path);

		case "bishop":
			return bishopAttackPaths.includes(path);

		case "rook":
			return rookAttackPaths.includes(path);

		case "queen":
			return queenAttackPaths.includes(path);

		case "king":
			return false;
	}
}

function inspect(chessboard: Chessboard, ownColor: ChessmanColor) {
	const king = getChessmanByInfo({ color: ownColor, type: "king" });
	const kingCoordinates = chessboard.getCoordinatesOfChessman(king);

	if (kingCoordinates.length !== 1) {
		return false;
	}

	const kingCoordinate = kingCoordinates[0]!;

	const enemyColor = getOtherChessmanColor(ownColor);
	const enemyChessmenTypes = chessboard.getChessmenTypesByColor(enemyColor);

	const boardScanner = new BoardScanner(kingCoordinate, collectScannerDirections(enemyColor, enemyChessmenTypes));

	while (true) {
		const scanStep = boardScanner.next();

		if (!scanStep) {
			return false;
		}

		const chessman = chessboard.getChessmanByCoordinate(scanStep.coordinate);

		if (chessman) {
			const { color } = getChessmanInfo(chessman);

			if (color === enemyColor && hasCheckByChessman(scanStep, chessman)) {
				return true;
			}

			if (color === ownColor) {
				boardScanner.stopScanPath(scanStep.direction.path);
			}
		}
	}
}

export function analyzeCheck(chessmenMap: ChessmenMap, lastActionChessmanColor: ChessmanColor): ChessmanColor | null {
	const chessboard = new Chessboard(chessmenMap);
	const colorsFotAnalysis = [lastActionChessmanColor, getOtherChessmanColor(lastActionChessmanColor)];

	for (const color of colorsFotAnalysis) {
		const hasCheck = inspect(chessboard, color);

		if (hasCheck) {
			return color;
		}
	}

	return null;
}
