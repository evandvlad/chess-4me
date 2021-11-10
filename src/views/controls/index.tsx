import React from "react";
import { observer, Observer } from "mobx-react-lite";

import type { Controls as ViewModelControls } from "~/view-models";

import { Button } from "./button";
import { AddChessmanControl } from "./add-chessman-control";

import styles from "./controls.module.scss";

interface Props {
	viewModel: ViewModelControls;
}

export const Controls = observer(function ControlsObserver({ viewModel }: Props) {
	return (
		<div className={styles.controls} data-test-controls="">
			<Button
				title="Empty Board"
				iconType="empty-board"
				onClick={viewModel.emptyBoard}
				data-test-control="empty-board"
			/>
			<Button title="New Game" iconType="new-game" onClick={viewModel.newGame} data-test-control="new-game" />
			<Button
				title="Flip Board"
				iconType="flip-board"
				onClick={viewModel.flipBoard}
				data-test-control="flip-board"
			/>
			<Observer>
				{() => (
					<Button
						title="Go Back"
						iconType="go-back"
						onClick={viewModel.goBack}
						isDisabled={!viewModel.isGoBackActionAvailable}
						data-test-control="go-back"
					/>
				)}
			</Observer>
			<Observer>
				{() => (
					<Button
						title="Go Forward"
						iconType="go-forward"
						onClick={viewModel.goForward}
						isDisabled={!viewModel.isGoForwardActionAvailable}
						data-test-control="go-forward"
					/>
				)}
			</Observer>
			<AddChessmanControl
				onAddChessman={viewModel.addChessman}
				getAvailableChessmen={viewModel.getAvailableChessmenForAdding}
				renderButton={(onClick) => (
					<Observer>
						{() => (
							<Button
								title="Add Chessman"
								iconType="add-chessman"
								onClick={onClick}
								isDisabled={!viewModel.isAddChessmanActionAvailable}
								data-test-control="add-chessman"
							/>
						)}
					</Observer>
				)}
			/>
			<Observer>
				{() => (
					<Button
						title="Remove Chessman"
						iconType="remove-chessman"
						onClick={viewModel.removeChessman}
						isDisabled={!viewModel.isRemoveChessmanActionAvailable}
						data-test-control="remove-chessman"
					/>
				)}
			</Observer>
		</div>
	);
});
