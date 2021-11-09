import type { BoardDirection, BoardCoordinate, Chessman } from "../app-values";
import type { OptionalValueBox } from "../utils/optional-value-box";
import type { PositionOnScreen } from "../utils/position-on-screen";
import type { Chessmen } from "./chessmen";

import {
	createAttributeName,
	createSelector,
	joinSelectors,
	extractAttributeValue,
} from "../utils/attributes-and-selectors";

export class Board {
	readonly #attributeName = createAttributeName("board");
	readonly #cellAttributeName = createAttributeName("board-cell");
	readonly #selectedCellAttributeName = createAttributeName("board-selected-cell");

	readonly #selector = createSelector(this.#attributeName);
	readonly #focusedCellSelector = createSelector(createAttributeName("board-focused-cell"));
	readonly #selectedCellSelector = createSelector(this.#selectedCellAttributeName);

	readonly #chessmenComponent: Chessmen;

	constructor(chessmen: Chessmen) {
		this.#chessmenComponent = chessmen;
	}

	assertDirection(direction: BoardDirection): void {
		const selector = createSelector(this.#attributeName, direction);
		cy.get(selector).should("have.attr", this.#attributeName, direction);
	}

	assertFocusedCell(coordinate: BoardCoordinate | null): void {
		this.#assertActiveCell(this.#focusedCellSelector, coordinate);
	}

	assertSelectedCell(coordinate: BoardCoordinate | null): void {
		this.#assertActiveCell(this.#selectedCellSelector, coordinate);
	}

	getCellPositionOnScreen(coordinate: BoardCoordinate): Cypress.Chainable<PositionOnScreen> {
		return this.#getCell(coordinate).then(($cell) => {
			const { x, y } = $cell[0]!.getBoundingClientRect();
			return { x, y };
		});
	}

	selectCell(coordinate: BoardCoordinate): void {
		this.#getCell(coordinate).click();
	}

	getSelectedCell(): Cypress.Chainable<OptionalValueBox<BoardCoordinate>> {
		return this.#getCells().then(($cells) => {
			const selectedCell = [...$cells].find((cell) => cell.hasAttribute(this.#selectedCellAttributeName));
			return extractAttributeValue<BoardCoordinate>(selectedCell, this.#cellAttributeName);
		});
	}

	assertChessman(chessman: Chessman | null, coordinate: BoardCoordinate): void {
		const selector = joinSelectors(this.#selector, createSelector(this.#cellAttributeName, coordinate));

		this.#chessmenComponent.get(selector).should("satisfy", (vals: Chessman[]) => {
			if (chessman === null) {
				return vals.length === 0;
			}

			return vals.length === 1 && vals[0] === chessman;
		});
	}

	#assertActiveCell(activeCellSelector: string, coordinate: BoardCoordinate | null): void {
		const selector = joinSelectors(this.#selector, activeCellSelector);

		if (coordinate === null) {
			cy.get(selector).should("not.exist");
			return;
		}

		cy.get(selector).should("have.attr", this.#cellAttributeName, coordinate);
	}

	#getCell(coordinate: BoardCoordinate): Cypress.Chainable<JQuery> {
		const selector = joinSelectors(this.#selector, createSelector(this.#cellAttributeName, coordinate));
		return cy.get(selector);
	}

	#getCells(): Cypress.Chainable<JQuery> {
		const selector = joinSelectors(this.#selector, createSelector(this.#cellAttributeName));
		return cy.get(selector);
	}
}
