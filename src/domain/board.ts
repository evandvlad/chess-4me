const coordinatePartsSeparator = "";
const pathPartsSeparator = "/";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

type File = typeof files[number];
type Rank = typeof ranks[number];

export type Coordinate = `${File}${typeof coordinatePartsSeparator}${Rank}`;

interface CoordinateInfo {
	readonly file: File;
	readonly rank: Rank;
}

type Distance = -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Path = `${Distance}${typeof pathPartsSeparator}${Distance}`;

interface PathInfo {
	readonly file: Distance;
	readonly rank: Distance;
}

function getCoordinateByInfo({ file, rank }: CoordinateInfo): Coordinate {
	return `${file}${coordinatePartsSeparator}${rank}`;
}

function getCoordinateInfo(coordinate: Coordinate): CoordinateInfo {
	const [file, rank] = coordinate.split(coordinatePartsSeparator) as [File, Rank];
	return { file, rank };
}

export const coordinates: ReadonlyArray<Coordinate> = files.flatMap((file) =>
	ranks.map<Coordinate>((rank) => getCoordinateByInfo({ file, rank })),
);

function getPathInfo(path: Path): PathInfo {
	const [file, rank] = path.split(pathPartsSeparator).map((value) => Number(value)) as [Distance, Distance];
	return { file, rank };
}

function lookupCoordinatePart<T extends File | Rank>(
	order: ReadonlyArray<T>,
	startCoordinatePart: T,
	distance: Distance,
): T | null {
	const newIndex = order.indexOf(startCoordinatePart) + distance;

	if (newIndex < 0 || newIndex >= order.length) {
		return null;
	}

	return order[newIndex]!;
}

export function lookupCoordinate(startCoordinate: Coordinate, path: Path): Coordinate | null {
	const pathInfo = getPathInfo(path);
	const coordinateInfo = getCoordinateInfo(startCoordinate);

	const newFile = lookupCoordinatePart(files, coordinateInfo.file, pathInfo.file);
	const newRank = lookupCoordinatePart(ranks, coordinateInfo.rank, pathInfo.rank);

	if (newFile === null || newRank === null) {
		return null;
	}

	return getCoordinateByInfo({ file: newFile, rank: newRank });
}
