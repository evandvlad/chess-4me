import React from "react";
import { render } from "react-dom";
import { App } from "~/view-models";
import { Board } from "./board";
import { Controls } from "./controls";
import { History } from "./history";
import { ChessmenDiff } from "./chessmen-diff";
import { SidebarTabs, SidebarTab } from "./sidebar-tabs";
import "./global.scss";
import styles from "./layout.module.scss";

function getPageWrapper() {
	const pageWrapperId = "page-wrapper";
	const pageWrapperInDom = document.getElementById(pageWrapperId);

	if (pageWrapperInDom) {
		pageWrapperInDom.remove();
	}

	const pageWrapper = document.createElement("div");
	pageWrapper.id = pageWrapperId;

	return pageWrapper;
}

const pageWrapper = getPageWrapper();

document.body.append(pageWrapper);

function Main() {
	const app = new App();

	return (
		<div className={styles.site}>
			<div className={styles.board}>
				<Board viewModel={app.board} />
			</div>
			<div className={styles.controls}>
				<Controls viewModel={app.controls} />
			</div>
			<div className={styles.sidebar}>
				<SidebarTabs>
					<SidebarTab name="history" title="History">
						<History viewModel={app.history} />
					</SidebarTab>
					<SidebarTab name="diff" title="Diff">
						<ChessmenDiff viewModel={app.chessmenDiff} />
					</SidebarTab>
				</SidebarTabs>
			</div>
		</div>
	);
}

render(<Main />, pageWrapper);
