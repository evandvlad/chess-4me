export type OptionalValueBox<T> = { value: T | null };

function optionalValueBox<T>(value: T | null): OptionalValueBox<T> {
	return { value };
}

export function forceTypify<T>(value: unknown): T {
	return value as T;
}

export type AttributeName = `data-test-${string}`;

export function createAttributeName(name: string): AttributeName {
	return `data-test-${name}`;
}

export function createSelector<T extends { toString: () => string }>(attributeName: AttributeName, value?: T): string {
	if (typeof value === "undefined") {
		return `[${attributeName}]`;
	}

	return `[${attributeName}="${value.toString()}"]`;
}

export function joinSelectors(selector1: string, selector2: string): string {
	return [selector1, selector2].join(" ");
}

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

export function extractAttributeValue<T extends string>(
	element: Element | null | undefined,
	attribute: AttributeName,
): OptionalValueBox<T> {
	return element?.hasAttribute(attribute)
		? optionalValueBox(element.getAttribute(attribute)! as T)
		: optionalValueBox<T>(null);
}
