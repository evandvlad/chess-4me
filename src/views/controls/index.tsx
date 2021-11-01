import React from "react";
import { observer } from "mobx-react-lite";

import type { Controls as IControls } from "~/view-models";

import { IconButton } from "./icon-button";
import { AddChessmanControl } from "./add-chessman-control";

import styles from "./controls.module.scss";

const ReactiveAddChessmanControl = observer(AddChessmanControl);

interface Props {
	controls: IControls;
}

export const Controls = observer(function Controls({ controls }: Props): JSX.Element {
	return (
		<div className={styles.controls} data-test-controls="">
			<IconButton
				title="Empty Board"
				iconType="empty-board"
				onClick={controls.emptyBoard}
				data-test-control="empty-board"
			/>
			<IconButton title="New Game" iconType="new-game" onClick={controls.newGame} data-test-control="new-game" />
			<IconButton
				title="Flip Board"
				iconType="flip-board"
				onClick={controls.flipBoard}
				data-test-control="flip-board"
			/>
			<IconButton
				title="Go Back"
				iconType="go-back"
				onClick={controls.goBack}
				isDisabled={!controls.isGoBackActionAvailable}
				data-test-control="go-back"
			/>
			<IconButton
				title="Go Forward"
				iconType="go-forward"
				onClick={controls.goForward}
				isDisabled={!controls.isGoForwardActionAvailable}
				data-test-control="go-forward"
			/>
			<ReactiveAddChessmanControl
				onAddChessman={controls.addChessman}
				getAvailableChessmen={controls.getAvailableChessmenForAdding}
				renderButton={(onClick) => (
					<IconButton
						title="Add Chessman"
						iconType="add-chessman"
						onClick={onClick}
						isDisabled={!controls.isAddChessmanActionAvailable}
						data-test-control="add-chessman"
					/>
				)}
			/>
			<IconButton
				title="Remove Chessman"
				iconType="remove-chessman"
				onClick={controls.removeChessman}
				isDisabled={!controls.isRemoveChessmanActionAvailable}
				data-test-control="remove-chessman"
			/>
		</div>
	);
});
