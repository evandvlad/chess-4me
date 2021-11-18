import { makeObservable, observable, computed, action } from "mobx";

import { Game } from "~/domain";

export class GameManager {
	@observable.ref private game: Game;

	constructor() {
		makeObservable(this);

		this.game = Game.createOnRegularMode();
	}

	@action
	newGameOnRegularMode() {
		this.game = Game.createOnRegularMode();
	}

	@action
	newGameOnEmptyBoardMode() {
		this.game = Game.createOnEmptyBoardMode();
	}

	@computed
	get currentGame() {
		return this.game;
	}
}
