type CoordinateComparisonResult = -1 | 0 | 1;

export interface PositionOnScreen {
	x: number;
	y: number;
}

function compareCoordinates(coordinate1: number, coordinate2: number): CoordinateComparisonResult {
	if (coordinate2 === coordinate1) {
		return 0;
	}

	return coordinate1 > coordinate2 ? -1 : 1;
}

type ComparisonResultOfPositionsOnScreen = {
	x: CoordinateComparisonResult;
	y: CoordinateComparisonResult;
};

export function comparePositionsOnScreens(
	position1: PositionOnScreen,
	position2: PositionOnScreen,
): ComparisonResultOfPositionsOnScreen {
	return {
		x: compareCoordinates(position1.x, position2.x),
		y: compareCoordinates(position1.y, position2.y),
	};
}
