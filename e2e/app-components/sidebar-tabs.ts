import type { SidebarTabsTab } from "../app-values";

export class SidebarTabs {
	readonly #selector = "[data-test-sidebar-tabs]";
	readonly #activeNavItemSelector = "[data-test-sidebar-tabs-nav-item-active]";
	readonly #navItemAttributeName = "data-test-sidebar-tabs-nav-item";

	getActiveTab() {
		const selector = `${this.#selector} ${this.#activeNavItemSelector}`;
		return cy.get(selector).then(($tab) => $tab[0]!.getAttribute(this.#navItemAttributeName) as SidebarTabsTab);
	}

	goToTab(tab: SidebarTabsTab) {
		const selector = `${this.#selector} [${this.#navItemAttributeName}="${tab}"]`;
		cy.get(selector).click();
	}
}
