import type { Chessman } from "../app-values";

export class Chessmen {
	readonly #attributeName = "data-test-chessman";
	readonly #underAttackAttributeName = "data-test-chessman-under-attack";

	getAll(parentSelector: string) {
		return this.#getByAttribute(parentSelector, this.#attributeName);
	}

	getUnderAttacks(parentSelector: string) {
		return this.#getByAttribute(parentSelector, this.#underAttackAttributeName);
	}

	select(parentSelector: string, chessman: Chessman) {
		const selector = `${parentSelector} [${this.#attributeName}="${chessman}"]`;
		cy.get(selector).click();
	}

	#getByAttribute(parentSelector: string, attributeName: string) {
		return cy.get(parentSelector).then(($parent) => {
			const elements = $parent[0]!.querySelectorAll(`[${attributeName}]`);
			return Array.from(elements).map((element) => element.getAttribute(attributeName) as Chessman);
		});
	}
}
