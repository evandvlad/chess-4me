import React from "react";
import { render } from "react-dom";

import { App } from "~/view-models";
import { Board } from "./board";
import { Controls } from "./controls";
import { History } from "./history";

import "./global.scss";
import styles from "./main.module.scss";

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

function Main(): JSX.Element {
	const app = new App();

	return (
		<div className={styles.site}>
			<div className={styles.board}>
				<Board board={app.board} />
			</div>
			<div className={styles.controls}>
				<Controls controls={app.controls} />
			</div>
			<div className={styles.history}>
				<History history={app.history} />
			</div>
		</div>
	);
}

render(<Main />, pageWrapper);
