import type { HistoryItem, HistoryItemValue } from "../app-values";

import { createAttributeName, createSelector, joinSelectors } from "../utils/attributes-and-selectors";

export class History {
	readonly #selector = createSelector(createAttributeName("history"));
	readonly #itemAttributeName = createAttributeName("history-item");
	readonly #itemCurrentAttributeName = createAttributeName("history-item-current");
	readonly #itemContentAttributeName = createAttributeName("history-item-content");

	assertItems(items: HistoryItem[]) {
		this.#getItems().then((historyItems) => {
			expect(historyItems).to.eql(items);
		});
	}

	assertCurrentItemIndex(index: number | undefined) {
		this.#getItems().then((items) => {
			const currentItem = items.find(({ isCurrent }) => isCurrent) ?? { index: undefined };
			expect(currentItem.index).to.equal(index);
		});
	}

	selectByIndex(index: number) {
		const selector = joinSelectors(this.#selector, createSelector(this.#itemAttributeName, index.toString()));
		cy.get(selector).click();
	}

	#getItems(): Cypress.Chainable<HistoryItem[]> {
		return cy.get(this.#selector).then(($parent) => {
			const items = $parent[0]!.querySelectorAll(createSelector(this.#itemAttributeName));

			return Array.from(items).map((item) => ({
				index: Number(item.getAttribute(this.#itemAttributeName)),
				isCurrent: item.hasAttribute(this.#itemCurrentAttributeName),
				value: item
					.querySelector(createSelector(this.#itemContentAttributeName))!
					.getAttribute(this.#itemContentAttributeName) as HistoryItemValue,
			}));
		});
	}
}
