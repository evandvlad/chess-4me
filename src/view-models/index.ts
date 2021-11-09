import { GameManagement } from "./game-management";
import { Board } from "./board";
import { Controls } from "./controls";
import { History } from "./history";

export class App {
	readonly board: Board;
	readonly controls: Controls;
	readonly history: History;

	constructor() {
		const gameManagement = new GameManagement();

		this.board = new Board(gameManagement);
		this.controls = new Controls(gameManagement, this.board);
		this.history = new History(gameManagement);
	}
}

export type { Board, Controls, History };
