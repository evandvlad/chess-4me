import type { GameControlName } from "../app-values";

import { createAttributeName, createSelector, joinSelectors } from "../utils";

export class GameControls {
	readonly #selector = createSelector(createAttributeName("game-controls"));
	readonly #controlAttributeName = createAttributeName("game-control");

	assertControlAvailability(controlName: GameControlName, isEnabled = true): void {
		this.#getControl(controlName).should(isEnabled ? "be.enabled" : "be.disabled");
	}

	performAction(controlName: GameControlName): void {
		this.#getControl(controlName).click();
	}

	#getControl(controlName: GameControlName): Cypress.Chainable<JQuery> {
		const selector = joinSelectors(this.#selector, createSelector(this.#controlAttributeName, controlName));
		return cy.get(selector);
	}
}
