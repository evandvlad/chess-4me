import React, { useRef, useEffect } from "react";

import type { Chessman as IChessman } from "~/domain";

import { Chessman } from "../chessman";

import styles from "./add-chessman-dialog.module.scss";

interface HtmlDialog extends HTMLElement {
	show: () => void;
	close: () => void;
}

function Option({ chessman, onSelect }: { chessman: IChessman; onSelect: (chessman: IChessman) => void }) {
	function handleClick() {
		onSelect(chessman);
	}

	const chessmanValue = `${chessman.color}-${chessman.type}`;

	return (
		<div className={styles.option} onClick={handleClick} data-test-chessman-option={chessmanValue}>
			<Chessman chessman={chessman} />
		</div>
	);
}

export function AddChessmanDialog({
	availableChessmen,
	onClose,
}: {
	availableChessmen: ReadonlyArray<IChessman>;
	onClose: (result: IChessman | null) => void;
}): JSX.Element {
	const dialogRef = useRef<HtmlDialog>(null);

	function handleClose() {
		onClose(null);
	}

	function handleSelect(chessman: IChessman) {
		onClose(chessman);
	}

	function handleAllClicks(e: Event) {
		if (!dialogRef.current?.contains(e.target as Node)) {
			onClose(null);
		}
	}

	useEffect(() => {
		dialogRef.current?.addEventListener("close", handleClose);
		dialogRef.current?.show();
		window.addEventListener("click", handleAllClicks);

		return () => {
			window.removeEventListener("click", handleAllClicks);
			dialogRef.current?.close();
			dialogRef.current?.removeEventListener("close", handleClose);
		};
	}, []);

	const options = availableChessmen.map((chessman) => {
		const key = `${chessman.color}-${chessman.type}`;
		return <Option key={key} chessman={chessman} onSelect={handleSelect} />;
	});

	return (
		<dialog className={styles.dialog} ref={dialogRef} data-test-add-chessman-dialog="">
			{options}
		</dialog>
	);
}
