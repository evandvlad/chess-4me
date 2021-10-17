import type { Chessman } from "../app-values";

import { createAttributeName, createSelector, joinSelectors } from "../utils";

export class Chessmen {
	readonly #attributeName = createAttributeName("chessman");
	readonly #selector = createSelector(this.#attributeName);

	get(parentSelector: string): Cypress.Chainable<Chessman[]> {
		return cy.get(parentSelector).then(($parent) => {
			const elements = $parent[0]!.querySelectorAll(this.#selector);
			return Array.from(elements, (element) => element.getAttribute(this.#attributeName) as Chessman);
		});
	}

	select(parentSelector: string, chessman: Chessman): void {
		const selector = joinSelectors(parentSelector, createSelector(this.#attributeName, chessman));
		cy.get(selector).click();
	}
}
