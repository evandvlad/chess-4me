import { makeObservable, observable, computed, action } from "mobx";

import { Game } from "~/domain";

export class GameManagement {
	@observable.ref private game: Game;

	constructor() {
		makeObservable(this);

		this.game = new Game();
	}

	@action
	newGame(): void {
		this.game = new Game();
	}

	@computed
	get currentGame(): Game {
		return this.game;
	}
}
