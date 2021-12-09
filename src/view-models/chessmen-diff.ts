import { makeObservable, computed, comparer } from "mobx";
import { type ChessmanColor } from "~/domain";
import { type GameManager } from "./game-manager";

type ChessmenDiffGroup = ChessmanColor;

export class ChessmenDiff {
	readonly #gameManager: GameManager;

	constructor(gameManager: GameManager) {
		makeObservable(this);

		this.#gameManager = gameManager;
	}

	@computed({ equals: comparer.shallow })
	get groups(): ChessmenDiffGroup[] {
		return Array.from(this.details.keys()).filter((color) => this.details.get(color)!.length > 0);
	}

	getDetailsByGroup(group: ChessmenDiffGroup) {
		return this.details.get(group)!;
	}

	@computed
	private get details() {
		const { chessmenDiffDetails } = this.#gameManager.currentGame;
		return chessmenDiffDetails;
	}
}
