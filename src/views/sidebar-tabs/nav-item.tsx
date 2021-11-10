import React from "react";

import styles from "./sidebar-tabs.module.scss";

interface Props {
	index: number;
	name: string;
	title: string;
	isActive: boolean;
	onClick: (index: number) => void;
}

export function NavItem({ name, title, index, isActive, onClick }: Props) {
	if (isActive) {
		const className = `${styles.navItem!} ${styles.active!}`;

		return (
			<span
				className={className}
				data-test-sidebar-tabs-nav-item={name}
				data-test-sidebar-tabs-nav-item-active=""
			>
				{title}
			</span>
		);
	}

	function handleClick() {
		onClick(index);
	}

	return (
		<button type="button" className={styles.navItem} onClick={handleClick} data-test-sidebar-tabs-nav-item={name}>
			{title}
		</button>
	);
}
