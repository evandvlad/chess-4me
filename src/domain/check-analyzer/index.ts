import {
	type ChessmenMap,
	type ChessmanColor,
	type ChessmanType,
	getOtherChessmanColor,
	getChessmanByInfo,
	getChessmanInfo,
} from "../chessmen";
import { type Path } from "../board";
import { type ScanDirection, BoardScanner } from "./board-scanner";
import { getChessmanAttackPathes, isUnderChessmanAttack } from "./chessman-attack";
import { hasOnly } from "~/utils/set";
import { uniq } from "~/utils/array";

function getEnemyChessmenTypes(chessmenMap: ChessmenMap, enemyColor: ChessmanColor) {
	const result = new Set<ChessmanType>();

	for (const chessman of chessmenMap.values()) {
		const { color, type } = getChessmanInfo(chessman);

		if (color === enemyColor) {
			result.add(type);
		}
	}

	return result;
}

function getOwnKingCoordinate(chessmenMap: ChessmenMap, ownColor: ChessmanColor) {
	const king = getChessmanByInfo({ color: ownColor, type: "king" });

	const kingCoordinates = Array.from(chessmenMap)
		.filter(([, chessman]) => chessman === king)
		.map(([coordinate]) => coordinate);

	return kingCoordinates.length === 1 ? kingCoordinates[0]! : null;
}

function createScannerDirections(paths: ReadonlyArray<Path>, iterateOnce: boolean): ScanDirection[] {
	return paths.map((path) => ({ path, iterateOnce }));
}

function collectScannerDirections(chessmenMap: ChessmenMap, enemyColor: ChessmanColor) {
	const enemyChessmenTypes = getEnemyChessmenTypes(chessmenMap, enemyColor);
	const directions: ScanDirection[] = [];

	enemyChessmenTypes.delete("king");

	if (enemyChessmenTypes.has("knight")) {
		directions.push(
			...createScannerDirections(getChessmanAttackPathes({ type: "knight", color: enemyColor }), true),
		);

		if (hasOnly(enemyChessmenTypes, "knight")) {
			return directions;
		}

		enemyChessmenTypes.delete("knight");
	}

	if (hasOnly(enemyChessmenTypes, "pawn")) {
		directions.push(...createScannerDirections(getChessmanAttackPathes({ type: "pawn", color: enemyColor }), true));
		return directions;
	}

	const restPaths = uniq(
		Array.from(enemyChessmenTypes).flatMap((type) => getChessmanAttackPathes({ type, color: enemyColor })),
	);

	directions.push(...createScannerDirections(restPaths, false));

	return directions;
}

function inspect(chessmenMap: ChessmenMap, ownColor: ChessmanColor) {
	const kingCoordinate = getOwnKingCoordinate(chessmenMap, ownColor);

	if (!kingCoordinate) {
		return false;
	}

	const enemyColor = getOtherChessmanColor(ownColor);
	const boardScanner = new BoardScanner(kingCoordinate, collectScannerDirections(chessmenMap, enemyColor));

	while (true) {
		const scanStep = boardScanner.next();

		if (!scanStep) {
			return false;
		}

		const chessman = chessmenMap.get(scanStep.coordinate);

		if (!chessman) {
			continue;
		}

		const chessmanInfo = getChessmanInfo(chessman);

		if (
			chessmanInfo.color === enemyColor &&
			isUnderChessmanAttack(chessmanInfo, scanStep.direction.path, scanStep.iterations)
		) {
			return true;
		}

		if (chessmanInfo.color === ownColor) {
			boardScanner.stopScanPath(scanStep.direction.path);
		}
	}
}

export function analyzeCheck(chessmenMap: ChessmenMap, lastActionChessmanColor: ChessmanColor): ChessmanColor | null {
	const colorsFotAnalysis = [lastActionChessmanColor, getOtherChessmanColor(lastActionChessmanColor)];

	for (const color of colorsFotAnalysis) {
		const hasCheck = inspect(chessmenMap, color);

		if (hasCheck) {
			return color;
		}
	}

	return null;
}
