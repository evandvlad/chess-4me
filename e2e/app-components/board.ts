import { type PositionOnScreen } from "../helpers/position-on-screen";
import { type Chessmen } from "./chessmen";
import { optionalValueBox } from "../helpers/optional-value-box";
import { type BoardDirection, type BoardCoordinate, type ChessmenMap, boardCoordinates } from "../app-values";

export class Board {
	readonly #attributeName = "data-test-board";
	readonly #cellAttributeName = "data-test-board-cell";
	readonly #selectedCellAttributeName = "data-test-board-selected-cell";
	readonly #focusedCellAttributeName = "data-test-board-focused-cell";

	readonly #selector = `[${this.#attributeName}]`;

	readonly #chessmenComponent: Chessmen;

	constructor(chessmen: Chessmen) {
		this.#chessmenComponent = chessmen;
	}

	getDirection() {
		return cy.get(this.#selector).then(($board) => $board[0]!.getAttribute(this.#attributeName) as BoardDirection);
	}

	getSelectedCell() {
		return this.#getCells().then(($cells) => this.#findActiveCell($cells, this.#selectedCellAttributeName));
	}

	getFocusedCell() {
		return this.#getCells().then(($cells) => this.#findActiveCell($cells, this.#focusedCellAttributeName));
	}

	getCellPositionsOnScreen(coordinates: BoardCoordinate[]) {
		const map = new Map<BoardCoordinate, PositionOnScreen>();

		coordinates.forEach((coordinate) => {
			this.#getCell(coordinate).then(($cell) => {
				const { x, y } = $cell[0]!.getBoundingClientRect();
				map.set(coordinate, { x, y });
			});
		});

		return cy.wrap(map);
	}

	selectCell(coordinate: BoardCoordinate) {
		this.#getCell(coordinate).click();
	}

	getChessman(coordinate: BoardCoordinate) {
		const selector = `${this.#selector} [${this.#cellAttributeName}="${coordinate}"]`;
		return this.#chessmenComponent.getAll(selector).then((chessmen) => optionalValueBox(chessmen[0] ?? null));
	}

	hasChessmanAndUnderAttack(coordinate: BoardCoordinate) {
		const selector = `${this.#selector} [${this.#cellAttributeName}="${coordinate}"]`;

		return this.#chessmenComponent
			.getUnderAttacks(selector)
			.then((chessmen) => optionalValueBox(chessmen.length === 1));
	}

	getChessmenMap() {
		const map: ChessmenMap = new Map();

		boardCoordinates.forEach((coordinate) => {
			this.getChessman(coordinate).then(({ value }) => {
				if (value) {
					map.set(coordinate, value);
				}
			});
		});

		return cy.wrap(map);
	}

	#findActiveCell($cells: JQuery<HTMLElement>, activeAttributeName: string) {
		const activeCell = Array.from($cells).find((cell) => cell.hasAttribute(activeAttributeName));

		return optionalValueBox(
			activeCell ? (activeCell.getAttribute(this.#cellAttributeName) as BoardCoordinate) : null,
		);
	}

	#getCell(coordinate: BoardCoordinate) {
		const selector = `${this.#selector} [${this.#cellAttributeName}="${coordinate}"]`;
		return cy.get(selector);
	}

	#getCells() {
		const selector = `${this.#selector} [${this.#cellAttributeName}]`;
		return cy.get(selector);
	}
}
