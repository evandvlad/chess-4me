import { makeObservable, observable, computed, action } from "mobx";

import { Game } from "~/domain";

export class GameManagement {
	@observable.ref private game: Game;

	constructor() {
		makeObservable(this);

		this.game = Game.createOnRegularMode();
	}

	@action
	newGameOnRegularMode(): void {
		this.game = Game.createOnRegularMode();
	}

	@action
	newGameOnEmptyBoardMode(): void {
		this.game = Game.createOnEmptyBoardMode();
	}

	@computed
	get currentGame(): Game {
		return this.game;
	}
}
