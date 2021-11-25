import { Chessmen } from "./chessmen";
import { AddChessmanDialog } from "./add-chessman-dialog";
import { Board } from "./board";
import { Controls } from "./controls";
import { History } from "./history";
import { SidebarTabs } from "./sidebar-tabs";
import { ChessmenDiff } from "./chessmen-diff";
import { Game } from "./game";

const chessmen = new Chessmen();

export const addChessmanDialog = new AddChessmanDialog(chessmen);
export const board = new Board(chessmen);
export const controls = new Controls();
export const history = new History();
export const sidebarTabs = new SidebarTabs();
export const chessmenDiff = new ChessmenDiff();
export const game = new Game({ board, controls, addChessmanDialog });
