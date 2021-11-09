import { makeObservable, computed } from "mobx";

import type { GameManagement } from "./game-management";

export class History {
	readonly #gameManagement: GameManagement;

	constructor(gameManagement: GameManagement) {
		makeObservable(this);

		this.#gameManagement = gameManagement;
	}

	@computed
	get items() {
		return this.#gameManagement.currentGame.history.items;
	}

	goByHistoryIndex = (index: number) => {
		this.#gameManagement.currentGame.history.goByHistoryIndex(index);
	};

	isCurrentHistoryIndex(index: number) {
		return this.#gameManagement.currentGame.history.isCurrentHistoryIndex(index);
	}
}
