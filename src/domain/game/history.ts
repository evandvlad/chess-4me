import { makeObservable, computed, observable, action } from "mobx";

import type { HistoryClientAPI, HistoryRecord, BoardState } from "./values";

import { assert } from "~/utils/assert";
import { EventsHub } from "~/utils/events-hub";

const initialStateCursorPosition = -1;

export class History implements HistoryClientAPI {
	@observable.shallow private readonly records: HistoryRecord[] = [];

	@observable private cursorPosition = initialStateCursorPosition;

	readonly #eventsHub = new EventsHub<{ changed: [] }>();
	readonly #initialBoardState: BoardState;

	constructor({ boardState, onChanged }: { boardState: BoardState; onChanged: () => void }) {
		makeObservable(this);

		this.#initialBoardState = boardState;
		this.#eventsHub.on("changed", onChanged);
	}

	@computed
	get items() {
		return this.records.map(({ item }) => item);
	}

	@computed
	get currentBoardState(): BoardState {
		return this.cursorPosition > initialStateCursorPosition
			? this.records[this.cursorPosition]!.boardState
			: this.#initialBoardState;
	}

	@computed
	get canGoBack(): boolean {
		return this.cursorPosition > initialStateCursorPosition;
	}

	@computed
	get canGoForward(): boolean {
		return this.cursorPosition < this.#lastRecordsIndex;
	}

	@action
	goBack(): void {
		assert(this.canGoBack, "Incorrect invariant for go back");
		this.cursorPosition -= 1;
		this.#eventsHub.trigger("changed");
	}

	@action
	goForward(): void {
		assert(this.canGoForward, "Incorrect invariant for go forward");
		this.cursorPosition += 1;
		this.#eventsHub.trigger("changed");
	}

	@action
	goByHistoryIndex(index: number) {
		assert(typeof this.records[index] !== "undefined", "Incorrect invariant for go by history index");
		this.cursorPosition = index;
		this.#eventsHub.trigger("changed");
	}

	isCurrentHistoryIndex(index: number) {
		return index !== initialStateCursorPosition && this.cursorPosition === index;
	}

	@action
	pushRecord(record: HistoryRecord): void {
		if (this.cursorPosition > initialStateCursorPosition) {
			this.records.splice(this.cursorPosition + 1);
		}

		this.records.push(record);
		this.cursorPosition = this.#lastRecordsIndex;
	}

	get #lastRecordsIndex() {
		return this.records.length - 1;
	}
}
