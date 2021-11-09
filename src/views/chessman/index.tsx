import React from "react";

import type { Chessman as IChessman } from "~/domain";
import { cssClassNames } from "~/utils/css-class-names";

import styles from "./chessman.module.scss";

interface Props {
	chessman: IChessman;
	className?: string;
}

export function Chessman({ chessman, className }: Props): JSX.Element {
	return (
		<span
			className={cssClassNames(styles.chessman, className)}
			data-style-chessman={chessman}
			data-test-chessman={chessman}
		/>
	);
}
