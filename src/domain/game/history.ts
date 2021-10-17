import { makeObservable, observable, computed, action } from "mobx";

import type { BoardCoordinate } from "../chess-setup";
import type { ChessmenMap } from "./chessmen";

import { assertTrue } from "~/utils/assert";
import { EventsHub } from "~/utils/events-hub";

export interface HistoryRecord {
	readonly chessmenMap: ChessmenMap;
	readonly activeCoordinate: BoardCoordinate | null;
}

interface HistoryLinkedNode {
	readonly record: HistoryRecord;
	readonly prevNode: HistoryLinkedNode | null;
	nextNode: HistoryLinkedNode | null;
}

export interface HistoryClientAPI {
	readonly canGoBack: boolean;
	readonly canGoForward: boolean;
	goBack: () => void;
	goForward: () => void;
}

interface Parameters {
	initialRecord: HistoryRecord;
	onChanged: () => void;
}

export class History implements HistoryClientAPI {
	@observable.ref private historyLinkedNode: HistoryLinkedNode;

	readonly #eventsHub: EventsHub<{ changed: [] }>;

	constructor({ initialRecord, onChanged }: Parameters) {
		makeObservable(this);

		this.#eventsHub = new EventsHub();
		this.#eventsHub.on("changed", onChanged);

		this.historyLinkedNode = this.#createLinkedNode(initialRecord, null);
	}

	@computed
	get currentRecord(): HistoryRecord {
		return this.historyLinkedNode.record;
	}

	@computed
	get canGoBack(): boolean {
		return this.historyLinkedNode.prevNode !== null;
	}

	@computed
	get canGoForward(): boolean {
		return this.historyLinkedNode.nextNode !== null;
	}

	@action
	goBack(): void {
		assertTrue(this.canGoBack, "Incorrect invariant for go back");
		this.historyLinkedNode = this.historyLinkedNode.prevNode!;
		this.#eventsHub.trigger("changed");
	}

	@action
	goForward(): void {
		assertTrue(this.canGoForward, "Incorrect invariant for go forward");
		this.historyLinkedNode = this.historyLinkedNode.nextNode!;
		this.#eventsHub.trigger("changed");
	}

	@action
	addRecord(record: HistoryRecord): void {
		this.historyLinkedNode = this.#createLinkedNode(record, this.historyLinkedNode);
	}

	#createLinkedNode(record: HistoryRecord, prevNode: HistoryLinkedNode | null): HistoryLinkedNode {
		const newNode = { prevNode, record, nextNode: null };

		if (prevNode) {
			prevNode.nextNode = newNode;
		}

		return newNode;
	}
}
