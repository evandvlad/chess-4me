import type { Chessman } from "../app-values";

export class Chessmen {
	readonly #attributeName = "data-test-chessman";
	readonly #selector = `[${this.#attributeName}]`;

	get(parentSelector: string) {
		return cy.get(parentSelector).then(($parent) => {
			const elements = $parent[0]!.querySelectorAll(this.#selector);
			return Array.from(elements).map((element) => element.getAttribute(this.#attributeName) as Chessman);
		});
	}

	select(parentSelector: string, chessman: Chessman) {
		const selector = `${parentSelector} [${this.#attributeName}="${chessman}"]`;
		cy.get(selector).click();
	}
}
