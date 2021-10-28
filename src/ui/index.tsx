import React from "react";
import { render } from "react-dom";

import { App } from "~/view-models";
import { Board } from "./board";
import { GameControls } from "./game-controls";

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
			<div className={styles.mainBoard}>
				<Board mainBoard={app.mainBoard} />
			</div>
			<div className={styles.gameControls}>
				<GameControls gameControls={app.gameControls} />
			</div>
		</div>
	);
}

render(<Main />, pageWrapper);
