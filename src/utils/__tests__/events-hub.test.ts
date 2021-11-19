import { EventsHub } from "../events-hub";

describe("utils/events-hub", () => {
	it("on/trigger for single event with several argument", () => {
		const listener = cy.spy();
		const eventsHub = new EventsHub<{ event: [number, string, boolean, string?] }>();

		eventsHub.on("event", listener);
		eventsHub.trigger("event", 5, "test", true);

		expect(listener).calledWith(5, "test", true);
	});

	it("several events & listeners with disposing", () => {
		const event1Listener = cy.spy();
		const event2Listener = cy.spy();

		const eventsHub = new EventsHub<{ event1: [string]; event2: [boolean?] }>();

		eventsHub.trigger("event1", "test1");
		eventsHub.trigger("event2");

		const disposeEvent1Listener = eventsHub.on("event1", event1Listener);
		eventsHub.on("event2", event2Listener);

		eventsHub.trigger("event1", "test2");
		eventsHub.trigger("event2", true);

		disposeEvent1Listener();

		eventsHub.trigger("event1", "test3");
		eventsHub.trigger("event2", false);

		expect(event1Listener).callCount(1);
		expect(event1Listener).calledWith("test2");

		expect(event2Listener).callCount(2);
		expect(event2Listener).calledWith(false);
	});
});
