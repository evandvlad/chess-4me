import type {
	BoardCoordinate,
	Chessman,
	HistoryItemValue,
	ChessmenMap,
	SidebarTabsTab,
	ChessmenDiffItem,
} from "../app-values";
import type { AddChessmanDialog } from "./add-chessman-dialog";
import type { Board } from "./board";
import type { Controls } from "./controls";
import type { History } from "./history";
import type { SidebarTabs } from "./sidebar-tabs";
import type { ChessmenDiff } from "./chessmen-diff";

import { initialChessmenArrangement } from "../app-values";

interface Parameters {
	board: Board;
	controls: Controls;
	addChessmanDialog: AddChessmanDialog;
	history: History;
	sidebarTabs: SidebarTabs;
	chessmenDiff: ChessmenDiff;
}

export class App {
	readonly #board: Board;
	readonly #controls: Controls;
	readonly #addChessmanDialog: AddChessmanDialog;
	readonly #history: History;
	readonly #sidebarTabs: SidebarTabs;
	readonly #chessmenDiff: ChessmenDiff;

	constructor({ board, controls, addChessmanDialog, history, sidebarTabs, chessmenDiff }: Parameters) {
		this.#board = board;
		this.#controls = controls;
		this.#addChessmanDialog = addChessmanDialog;
		this.#history = history;
		this.#sidebarTabs = sidebarTabs;
		this.#chessmenDiff = chessmenDiff;
	}

	moveChessman(chessman: Chessman, sourceCoordinate: BoardCoordinate, destinationCoordinate: BoardCoordinate) {
		this.#board.assertChessman(chessman, sourceCoordinate);
		this.#board.selectCell(sourceCoordinate);
		this.#board.assertSelectedCell(sourceCoordinate);
		this.#board.selectCell(destinationCoordinate);
		this.#board.assertSelectedCell(null);
		this.#board.assertFocusedCell(destinationCoordinate);
		this.#board.assertChessman(chessman, destinationCoordinate);
	}

	addChessman(chessman: Chessman, coordinate: BoardCoordinate) {
		this.#board.assertChessman(undefined, coordinate);
		this.#board.selectCell(coordinate);
		this.#controls.assertControlAvailability("add-chessman");
		this.#controls.performAction("add-chessman");
		this.#addChessmanDialog.assertVisibility();
		this.#addChessmanDialog.select(chessman);
		this.#addChessmanDialog.assertVisibility(false);
		this.#controls.assertControlAvailability("add-chessman", false);
		this.#board.assertChessman(chessman, coordinate);
		this.#board.assertSelectedCell(null);
		this.#board.assertFocusedCell(coordinate);
	}

	removeChessman(chessman: Chessman, coordinate: BoardCoordinate) {
		this.#board.assertChessman(chessman, coordinate);
		this.#board.selectCell(coordinate);
		this.#board.assertSelectedCell(coordinate);
		this.#controls.assertControlAvailability("remove-chessman");
		this.#controls.performAction("remove-chessman");
		this.#board.assertSelectedCell(null);
		this.#board.assertFocusedCell(coordinate);
		this.#controls.assertControlAvailability("remove-chessman", false);
	}

	assertChessmenArrangement(chessmenMap: ChessmenMap) {
		this.#board.assertChessmenMap(chessmenMap);
	}

	newGameOnRegularMode(selectedSidebarTab: SidebarTabsTab = "history") {
		this.#controls.performAction("new-game");

		this.assertChessmenArrangement(initialChessmenArrangement);
		this.#board.assertSelectedCell(null);
		this.#board.assertFocusedCell(null);

		this.#assertSidebarTabContent(selectedSidebarTab);
	}

	newGameOnEmptyBoardMode(selectedSidebarTab: SidebarTabsTab = "history") {
		this.#controls.performAction("empty-board");

		this.assertChessmenArrangement(new Map());
		this.#board.assertSelectedCell(null);
		this.#board.assertFocusedCell(null);

		this.#assertSidebarTabContent(selectedSidebarTab);
	}

	goBack() {
		this.#controls.assertControlAvailability("go-back");
		this.#controls.performAction("go-back");
	}

	goForward() {
		this.#controls.performAction("go-forward");
	}

	goByHistoryIndex(index: number) {
		this.#sidebarTabs.assertActiveTab("history");
		this.#history.selectByIndex(index);
		this.#history.assertCurrentItemIndex(index);
	}

	flipBoard() {
		this.#controls.assertControlAvailability("flip-board");
		this.#controls.performAction("flip-board");
	}

	goToTabOnSidebar(tab: SidebarTabsTab) {
		this.#sidebarTabs.goToTab(tab);
		this.#sidebarTabs.assertActiveTab(tab);
	}

	assertHistory(values: HistoryItemValue[], currentItem: number | undefined) {
		this.#sidebarTabs.assertActiveTab("history");

		const maxIndex = values.length - 1;

		const historyItems = values.map((value, i) => {
			const index = maxIndex - i;

			return {
				value,
				index,
				isCurrent: index === currentItem,
			};
		});

		this.#history.assertItems(historyItems);
	}

	assertChessmenDiff(items: ChessmenDiffItem[]) {
		this.#chessmenDiff.assertItems(items);
	}

	#assertSidebarTabContent(tab: SidebarTabsTab) {
		switch (tab) {
			case "history":
				this.#history.assertItems([]);
				return;

			case "diff":
				this.#chessmenDiff.assertItems([]);
				return;
		}
	}
}
