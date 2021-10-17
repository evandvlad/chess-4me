import { GameManagement } from "./game-management";
import { MainBoard } from "./main-board";
import { GameControls } from "./game-controls";

export class App {
	readonly mainBoard: MainBoard;
	readonly gameControls: GameControls;

	constructor() {
		const gameManagement = new GameManagement();

		this.mainBoard = new MainBoard(gameManagement);
		this.gameControls = new GameControls({ gameManagement, mainBoard: this.mainBoard });
	}
}

export type { MainBoard, GameControls };
