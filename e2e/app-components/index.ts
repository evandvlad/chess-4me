import { Chessmen } from "./chessmen";
import { AddChessmanDialog } from "./add-chessman-dialog";
import { Board } from "./board";
import { GameControls } from "./game-controls";
import { App } from "./app";

const chessmen = new Chessmen();

export const addChessmanDialog = new AddChessmanDialog(chessmen);
export const board = new Board(chessmen);
export const gameControls = new GameControls();
export const app = new App({ board, gameControls, addChessmanDialog });
