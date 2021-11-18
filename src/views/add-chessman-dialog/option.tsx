import React from "react";

import type { Chessman as DomainChessman } from "~/domain";

import { Chessman } from "../chessman";

import styles from "./add-chessman-dialog.module.scss";

interface Props {
	chessman: DomainChessman;
	onSelect: (chessman: DomainChessman) => void;
}

export function Option({ chessman, onSelect }: Props) {
	function handleClick() {
		onSelect(chessman);
	}

	return (
		<button type="button" className={styles.option} onClick={handleClick} data-test-chessman-option={chessman}>
			<Chessman chessman={chessman} />
		</button>
	);
}
