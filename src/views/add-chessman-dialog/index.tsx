import React, { useRef, useEffect } from "react";
import { type Chessman as DomainChessman } from "~/domain";
import { Option } from "./option";
import styles from "./add-chessman-dialog.module.scss";

interface HtmlDialog extends HTMLElement {
	show: () => void;
	close: () => void;
}

interface Props {
	availableChessmen: ReadonlyArray<DomainChessman>;
	onClose: (result: DomainChessman | null) => void;
}

export function AddChessmanDialog({ availableChessmen, onClose }: Props) {
	const dialogRef = useRef<HtmlDialog>(null);

	function handleClose() {
		onClose(null);
	}

	function handleSelect(chessman: DomainChessman) {
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

	const options = availableChessmen.map((chessman) => (
		<Option key={chessman} chessman={chessman} onSelect={handleSelect} />
	));

	return (
		<dialog className={styles.dialog} ref={dialogRef} data-test-add-chessman-dialog="">
			{options}
		</dialog>
	);
}
