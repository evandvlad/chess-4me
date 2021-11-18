import React from "react";

import styles from "./controls.module.scss";

interface Props {
	title: string;
	iconType: string;
	onClick: () => void;
	isDisabled?: boolean;
	[attrName: `data-test-${string}`]: string;
}

export function Button({ title, onClick, iconType, isDisabled = false, ...rest }: Props) {
	return (
		<button
			{...rest}
			type="button"
			className={styles.button}
			title={title}
			disabled={isDisabled}
			onClick={onClick}
			data-style-icon-type={iconType}
		/>
	);
}
