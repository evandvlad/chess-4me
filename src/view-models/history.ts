import { makeObservable, computed, action } from "mobx";

import type { HistoryItem as DomainHistoryItem } from "~/domain";
import type { GameManager } from "./game-manager";

class HistoryItem {
	constructor(readonly data: DomainHistoryItem, readonly index: number, readonly isCurrent: boolean) {}
}

export type { HistoryItem };

export class History {
	readonly #gameManager: GameManager;

	constructor(gameManager: GameManager) {
		makeObservable(this);

		this.#gameManager = gameManager;
	}

	@computed
	get items() {
		const { history } = this.#gameManager.currentGame;

		return history.items.map((item, index) => {
			const isCurrent = history.isCurrentHistoryIndex(index);
			return new HistoryItem(item, index, isCurrent);
		});
	}

	@action
	goByHistoryIndex = (index: number) => {
		const { history } = this.#gameManager.currentGame;
		history.goByHistoryIndex(index);
	};
}
