import { makeObservable, computed, observable, action } from "mobx";
import { type Coordinate } from "../board";
import { type Chessman } from "../chessmen";
import { type BoardState } from "./board-state";
import { assert } from "~/utils/assert";
import { EventsHub } from "~/utils/events-hub";
import { hasIndex } from "~/utils/array";

const initialStateCursorPosition = -1;

export type HistoryItem =
	| {
			readonly action: "adding";
			readonly chessman: Chessman;
			readonly coordinate: Coordinate;
	  }
	| {
			readonly action: "removing";
			readonly chessman: Chessman;
			readonly coordinate: Coordinate;
	  }
	| {
			readonly action: "moving";
			readonly chessman: Chessman;
			readonly sourceCoordinate: Coordinate;
			readonly destinationCoordinate: Coordinate;
			readonly isCapture: boolean;
	  };

export interface HistoryClientAPI {
	readonly canGoBack: boolean;
	readonly canGoForward: boolean;
	readonly items: ReadonlyArray<HistoryItem>;
	goBack: () => void;
	goForward: () => void;
	goByHistoryIndex: (index: number) => void;
	isCurrentHistoryIndex: (index: number) => boolean;
}

interface HistoryRecord {
	readonly item: HistoryItem;
	readonly boardState: BoardState;
}

interface Parameters {
	readonly boardState: BoardState;
	readonly onChanged: () => void;
}

export class History implements HistoryClientAPI {
	@observable.shallow private readonly records: HistoryRecord[] = [];

	@observable private cursorPosition = initialStateCursorPosition;

	readonly #eventsHub = new EventsHub<{ changed: [] }>();
	readonly #initialBoardState: BoardState;

	constructor({ boardState, onChanged }: Parameters) {
		makeObservable(this);

		this.#initialBoardState = boardState;
		this.#eventsHub.on("changed", onChanged);
	}

	@computed
	get items() {
		return this.records.map(({ item }) => item);
	}

	@computed
	get currentBoardState() {
		return this.cursorPosition > initialStateCursorPosition
			? this.records[this.cursorPosition]!.boardState
			: this.#initialBoardState;
	}

	@computed
	get canGoBack() {
		return this.cursorPosition > initialStateCursorPosition;
	}

	@computed
	get canGoForward() {
		return this.cursorPosition < this.#lastRecordsIndex;
	}

	@action
	goBack() {
		assert(this.canGoBack, "Incorrect invariant for go back");
		this.cursorPosition -= 1;
		this.#eventsHub.trigger("changed");
	}

	@action
	goForward() {
		assert(this.canGoForward, "Incorrect invariant for go forward");
		this.cursorPosition += 1;
		this.#eventsHub.trigger("changed");
	}

	@action
	goByHistoryIndex(index: number) {
		assert(hasIndex(this.records, index), "Incorrect invariant for go by history index");

		this.cursorPosition = index;
		this.#eventsHub.trigger("changed");
	}

	isCurrentHistoryIndex(index: number) {
		return index !== initialStateCursorPosition && this.cursorPosition === index;
	}

	@action
	pushRecord(record: HistoryRecord) {
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
