import React, { type ReactNode, type ReactElement, Children, useState } from "react";
import { NavItem } from "./nav-item";
import styles from "./sidebar-tabs.module.scss";

interface SidebarTabProps {
	name: string;
	title: string;
	children: ReactNode;
}

type ReactSidebarTabElement = ReactElement<SidebarTabProps>;

const sidebarTabMark = Symbol("sidebar-tab");

export function SidebarTab(props: SidebarTabProps) {
	return <>{props.children}</>;
}

SidebarTab[sidebarTabMark] = true;

function isSidebarTab(child: ReactElement<unknown>): child is ReactSidebarTabElement {
	const { type } = child;

	if (!type || typeof type === "string") {
		return false;
	}

	return Object.prototype.hasOwnProperty.call(type, sidebarTabMark);
}

export function SidebarTabs({ children }: { children: Array<ReactElement<unknown>> }) {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const navItems: ReactNode[] = [];

	Children.forEach(children, (child, index) => {
		if (!isSidebarTab(child)) {
			throw new Error("One of child elements from Sidebar Tabs children isn't a Sidebar Tab");
		}

		const { title, name } = child.props;

		navItems.push(
			<NavItem
				key={name}
				name={name}
				title={title}
				index={index}
				isActive={selectedIndex === index}
				onClick={setSelectedIndex}
			/>,
		);
	});

	return (
		<div className={styles.tabs} data-test-sidebar-tabs="">
			<div className={styles.nav}>{navItems}</div>
			<div className={styles.content}>{(children[selectedIndex] as ReactSidebarTabElement).props.children}</div>
		</div>
	);
}
