import React from "react";

import type { Chessman as IChessman } from "~/domain";

import styles from "./chessman.module.scss";

interface Props {
	chessman: IChessman;
}

export function Chessman({ chessman }: Props): JSX.Element {
	const chessmanValue = `${chessman.color}-${chessman.type}`;
	return <span className={styles.chessman} data-style-chessman={chessmanValue} data-test-chessman={chessmanValue} />;
}
