import type { ReactNode } from "react";
import type { Chessman } from "~/domain";

import React, { useState } from "react";
import { AddChessmanDialog } from "../add-chessman-dialog";

interface Props {
	onAddChessman: (chessman: Chessman) => void;
	getAvailableChessmen: () => ReadonlyArray<Chessman>;
	renderButton: (onClick: () => void) => ReactNode;
}

export function AddChessmanControl({ onAddChessman, getAvailableChessmen, renderButton }: Props): JSX.Element {
	const [isDialogVisible, updateDialogVisibility] = useState(false);

	function handleClick() {
		if (isDialogVisible) {
			return;
		}

		updateDialogVisibility(true);
	}

	function handleDialogClosed(result: Chessman | null) {
		updateDialogVisibility(false);

		if (result) {
			onAddChessman(result);
		}
	}

	return (
		<>
			{isDialogVisible && (
				<AddChessmanDialog availableChessmen={getAvailableChessmen()} onClose={handleDialogClosed} />
			)}
			{renderButton(handleClick)}
		</>
	);
}
