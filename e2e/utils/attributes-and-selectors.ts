import type { OptionalValueBox } from "./optional-value-box";

import { optionalValueBox } from "./optional-value-box";

export type AttributeName = `data-test-${string}`;

export function createAttributeName(name: string): AttributeName {
	return `data-test-${name}`;
}

export function createSelector<T extends { toString: () => string }>(attributeName: AttributeName, value?: T) {
	if (typeof value === "undefined") {
		return `[${attributeName}]`;
	}

	return `[${attributeName}="${value.toString()}"]`;
}

export function joinSelectors(selector1: string, selector2: string) {
	return [selector1, selector2].join(" ");
}

export function extractAttributeValue<T extends string>(
	element: Element | null | undefined,
	attribute: AttributeName,
): OptionalValueBox<T> {
	return element?.hasAttribute(attribute)
		? optionalValueBox(element.getAttribute(attribute)! as T)
		: optionalValueBox<T>(null);
}
