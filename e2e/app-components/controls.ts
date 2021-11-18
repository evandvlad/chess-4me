import type { GameControlName } from "../app-values";

import { createAttributeName, createSelector, joinSelectors } from "../utils/attributes-and-selectors";

export class Controls {
	readonly #selector = createSelector(createAttributeName("controls"));
	readonly #controlAttributeName = createAttributeName("control");

	assertControlAvailability(controlName: GameControlName, isEnabled = true) {
		this.#getControl(controlName).should(isEnabled ? "be.enabled" : "be.disabled");
	}

	performAction(controlName: GameControlName) {
		this.#getControl(controlName).click();
	}

	#getControl(controlName: GameControlName): Cypress.Chainable<JQuery> {
		const selector = joinSelectors(this.#selector, createSelector(this.#controlAttributeName, controlName));
		return cy.get(selector);
	}
}
