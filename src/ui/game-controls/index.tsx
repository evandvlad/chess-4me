import React from "react";
import { observer } from "mobx-react-lite";

import type { GameControls as IGameControls } from "~/view-models";

import { IconButton } from "./icon-button";
import { AddChessmanControl } from "./add-chessman-control";

import styles from "./game-controls.module.scss";

const ReactiveAddChessmanControl = observer(AddChessmanControl);

interface Props {
	gameControls: IGameControls;
}

export const GameControls = observer(function GameControls({ gameControls }: Props): JSX.Element {
	return (
		<div className={styles.controls} data-test-game-controls="">
			<IconButton
				title="Empty Board"
				iconType="empty-board"
				onClick={gameControls.emptyBoard}
				data-test-game-control="empty-board"
			/>
			<IconButton
				title="New Game"
				iconType="new-game"
				onClick={gameControls.newGame}
				data-test-game-control="new-game"
			/>
			<IconButton
				title="Flip Board"
				iconType="flip-board"
				onClick={gameControls.flipBoard}
				data-test-game-control="flip-board"
			/>
			<IconButton
				title="Go Back"
				iconType="go-back"
				onClick={gameControls.goBack}
				isDisabled={!gameControls.isGoBackActionAvailable}
				data-test-game-control="go-back"
			/>
			<IconButton
				title="Go Forward"
				iconType="go-forward"
				onClick={gameControls.goForward}
				isDisabled={!gameControls.isGoForwardActionAvailable}
				data-test-game-control="go-forward"
			/>
			<ReactiveAddChessmanControl
				onAddChessman={gameControls.addChessman}
				getAvailableChessmen={gameControls.getAvailableChessmenForAdding}
				renderButton={(onClick) => (
					<IconButton
						title="Add Chessman"
						iconType="add-chessman"
						onClick={onClick}
						isDisabled={!gameControls.isAddChessmanActionAvailable}
						data-test-game-control="add-chessman"
					/>
				)}
			/>
			<IconButton
				title="Remove Chessman"
				iconType="remove-chessman"
				onClick={gameControls.removeChessman}
				isDisabled={!gameControls.isRemoveChessmanActionAvailable}
				data-test-game-control="remove-chessman"
			/>
		</div>
	);
});
