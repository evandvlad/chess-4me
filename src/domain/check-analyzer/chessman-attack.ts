import { type ChessmanColor, type ChessmanInfo, chessmanColors } from "../chessmen";
import { type Path } from "../board";

const pawnAttackPaths: Record<ChessmanColor, ReadonlyArray<Path>> = {
	white: ["-1/-1", "1/-1"],
	black: ["-1/1", "1/1"],
};

const knightAttackPaths: ReadonlyArray<Path> = ["-2/-1", "-2/1", "-1/-2", "-1/2", "1/-2", "1/2", "2/-1", "2/1"];
const bishopAttackPaths: ReadonlyArray<Path> = chessmanColors.flatMap((color) => pawnAttackPaths[color]);
const rookAttackPaths: ReadonlyArray<Path> = ["-1/0", "0/-1", "0/1", "1/0"];
const queenAttackPaths: ReadonlyArray<Path> = [...bishopAttackPaths, ...rookAttackPaths];

export function getChessmanAttackPathes({ type, color }: ChessmanInfo): ReadonlyArray<Path> {
	switch (type) {
		case "pawn":
			return pawnAttackPaths[color];

		case "knight":
			return knightAttackPaths;

		case "bishop":
			return bishopAttackPaths;

		case "rook":
			return rookAttackPaths;

		case "queen":
			return queenAttackPaths;

		case "king":
			return [];
	}
}

export function isUnderChessmanAttack(chessmanInfo: ChessmanInfo, path: Path, distance: number) {
	const attackPaths = getChessmanAttackPathes(chessmanInfo);

	if (chessmanInfo.type === "pawn" || chessmanInfo.type === "knight") {
		return distance === 1 && attackPaths.includes(path);
	}

	return attackPaths.includes(path);
}
