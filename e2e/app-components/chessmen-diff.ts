import type { ChessmenDiffItem } from "../app-values";

import { createAttributeName, createSelector } from "../utils/attributes-and-selectors";

export class ChessmenDiff {
	readonly #selector = createSelector(createAttributeName("chessmen-diff"));
	readonly #itemAttributeName = createAttributeName("chessmen-diff-item");

	assertItems(items: ChessmenDiffItem[]) {
		this.#getItems().then((historyItems) => {
			expect(historyItems).to.eql(items);
		});
	}

	#getItems(): Cypress.Chainable<ChessmenDiffItem[]> {
		return cy.get(this.#selector).then(($parent) => {
			const items = $parent[0]!.querySelectorAll(createSelector(this.#itemAttributeName));
			return Array.from(items).map((item) => item.getAttribute(this.#itemAttributeName) as ChessmenDiffItem);
		});
	}
}
