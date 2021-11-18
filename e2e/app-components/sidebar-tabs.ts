import type { SidebarTabsTab } from "../app-values";

import { createAttributeName, createSelector, joinSelectors } from "../utils/attributes-and-selectors";

export class SidebarTabs {
	readonly #selector = createSelector(createAttributeName("sidebar-tabs"));
	readonly #navItemAttributeName = createAttributeName("sidebar-tabs-nav-item");
	readonly #activeNavItemAttributeName = createAttributeName("sidebar-tabs-nav-item-active");

	assertActiveTab(tab: SidebarTabsTab) {
		this.#getTab(tab).should("have.attr", this.#activeNavItemAttributeName);
	}

	goToTab(tab: SidebarTabsTab) {
		this.#getTab(tab).click();
	}

	#getTab(tab: SidebarTabsTab) {
		const selector = joinSelectors(this.#selector, createSelector(this.#navItemAttributeName, tab));
		return cy.get(selector);
	}
}
