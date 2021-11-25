import type { ChessmenDiffItem } from "../app-values";

export class ChessmenDiff {
	readonly #selector = "[data-test-chessmen-diff]";
	readonly #itemAttributeName = "data-test-chessmen-diff-item";
	readonly #itemSelector = `[${this.#itemAttributeName}]`;

	getItems() {
		return cy.get(this.#selector).then(($parent) => {
			const items = $parent[0]!.querySelectorAll(this.#itemSelector);
			return Array.from(items).map((item) => item.getAttribute(this.#itemAttributeName) as ChessmenDiffItem);
		});
	}
}
