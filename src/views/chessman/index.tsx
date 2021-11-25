import React from "react";

import type { Chessman as DomainChessman } from "~/domain";
import { cssClassNames } from "~/utils/css-class-names";

import styles from "./chessman.module.scss";

interface Props {
	chessman: DomainChessman;
	isUnderAttack?: boolean;
	className?: string;
}

export function Chessman({ chessman, className, isUnderAttack = false }: Props) {
	const classNames = cssClassNames(styles.chessman, { [styles.underAttack!]: isUnderAttack }, className);

	const dataAttributes: Record<`data-${string}`, string> = {
		"data-style-chessman": chessman,
		"data-test-chessman": chessman,
	};

	if (isUnderAttack) {
		dataAttributes["data-test-chessman-under-attack"] = chessman;
	}

	return <span className={classNames} {...dataAttributes} />;
}
