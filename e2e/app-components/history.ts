import type { HistoryItem } from "../app-values";

import { optionalValueBox } from "../helpers/optional-value-box";

export class History {
	readonly #selector = "[data-test-history]";
	readonly #itemCurrentSelector = "[data-test-history-item-current]";
	readonly #itemAttributeName = "data-test-history-item";
	readonly #itemContentAttributeName = "data-test-history-item-content";

	getCurrentItemIndex() {
		return cy.get(this.#selector).then(($history) => {
			const current = $history[0]!.querySelector(this.#itemCurrentSelector);
			return optionalValueBox(current ? Number(current.getAttribute(this.#itemAttributeName)) : null);
		});
	}

	selectByIndex(index: number) {
		const selector = `${this.#selector} [${this.#itemAttributeName}="${index}"]`;
		cy.get(selector).click();
	}

	getItems() {
		return cy.get(this.#selector).then(($parent) => {
			const items = $parent[0]!.querySelectorAll(`[${this.#itemContentAttributeName}]`);
			return Array.from(items).map((item) => item.getAttribute(this.#itemContentAttributeName) as HistoryItem);
		});
	}
}
