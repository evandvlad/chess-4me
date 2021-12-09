import { type HistoryItem, History } from "./history";
import { type Cell, Board } from "./board";
import { GameManager } from "./game-manager";
import { Controls } from "./controls";
import { ChessmenDiff } from "./chessmen-diff";

export class App {
	readonly board: Board;
	readonly controls: Controls;
	readonly history: History;
	readonly chessmenDiff: ChessmenDiff;

	constructor() {
		const gameManager = new GameManager();

		this.board = new Board(gameManager);
		this.controls = new Controls(gameManager, this.board);
		this.history = new History(gameManager);
		this.chessmenDiff = new ChessmenDiff(gameManager);
	}
}

export { type Board, type Cell, type Controls, type History, type ChessmenDiff, type HistoryItem };
