import React from "react";

import styles from "./game-controls.module.scss";

interface Props {
	title: string;
	iconType: string;
	onClick: () => void;
	isDisabled?: boolean;
	[attrName: `data-test-${string}`]: string;
}

export function IconButton({ title, onClick, iconType, isDisabled = false, ...rest }: Props): JSX.Element {
	return (
		<button
			{...rest}
			type="button"
			className={styles.iconButton}
			title={title}
			disabled={isDisabled}
			onClick={onClick}
			data-style-icon-type={iconType}
		/>
	);
}
