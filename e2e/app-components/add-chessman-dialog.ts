import type { Chessman } from "../app-values";
import type { Chessmen as ChessmenComponent } from "./chessmen";

import { createAttributeName, createSelector } from "../utils/attributes-and-selectors";

export class AddChessmanDialog {
	readonly #selector = createSelector(createAttributeName("add-chessman-dialog"));
	readonly #chessmenComponent: ChessmenComponent;

	constructor(chessmen: ChessmenComponent) {
		this.#chessmenComponent = chessmen;
	}

	assertVisibility(isEnabled = true): void {
		cy.get(this.#selector).should(isEnabled ? "be.visible" : "not.exist");
	}

	select(chessman: Chessman): void {
		this.#chessmenComponent.select(this.#selector, chessman);
	}

	getChessmen(): Cypress.Chainable<Chessman[]> {
		return this.#chessmenComponent.get(this.#selector);
	}
}
