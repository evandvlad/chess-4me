import { type Chessman } from "../app-values";
import { type Chessmen as ChessmenComponent } from "./chessmen";

export class AddChessmanDialog {
	readonly #selector = "[data-test-add-chessman-dialog]";
	readonly #chessmenComponent: ChessmenComponent;

	constructor(chessmen: ChessmenComponent) {
		this.#chessmenComponent = chessmen;
	}

	isVisible() {
		return cy.document().then((document) => document.querySelector(this.#selector) !== null);
	}

	select(chessman: Chessman) {
		this.#chessmenComponent.select(this.#selector, chessman);
	}

	getChessmen() {
		return this.#chessmenComponent.getAll(this.#selector);
	}
}
