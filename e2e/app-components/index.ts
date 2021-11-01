import { Chessmen } from "./chessmen";
import { AddChessmanDialog } from "./add-chessman-dialog";
import { Board } from "./board";
import { Controls } from "./controls";
import { History } from "./history";
import { App } from "./app";

const chessmen = new Chessmen();

export const addChessmanDialog = new AddChessmanDialog(chessmen);
export const board = new Board(chessmen);
export const controls = new Controls();
export const history = new History();
export const app = new App({ board, controls, addChessmanDialog, history });
