import type { HistoryItem } from "./history";
import type { Cell } from "./board";

import { GameManager } from "./game-manager";
import { Board } from "./board";
import { Controls } from "./controls";
import { History } from "./history";
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

export type { Board, Cell, Controls, History, ChessmenDiff, HistoryItem };
