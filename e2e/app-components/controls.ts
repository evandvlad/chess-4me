import { type GameControlName } from "../app-values";

export class Controls {
	readonly #selector = "[data-test-controls]";
	readonly #controlAttributeName = "data-test-control";

	isControlAvailable(controlName: GameControlName) {
		return this.#getControl(controlName).then(($control) => {
			const isDisabled = ($control[0]! as HTMLButtonElement).disabled;
			return !isDisabled;
		});
	}

	performAction(controlName: GameControlName) {
		this.#getControl(controlName).click();
	}

	#getControl(controlName: GameControlName) {
		const selector = `${this.#selector} [${this.#controlAttributeName}="${controlName}"]`;
		return cy.get(selector);
	}
}
