type Listener<T extends unknown[]> = (...args: T) => void;
type Dispose = () => void;

export class EventsHub<T extends Record<string, unknown[]>> {
	readonly #eventsListeners = Object.create(null) as {
		[U in keyof T]?: Array<Listener<T[U]>>;
	};

	on<K extends keyof T>(event: K, listener: Listener<T[K]>): Dispose {
		const eventListeners = this.#eventsListeners[event] ?? [];
		const listenerIndex = eventListeners.length + 1;

		eventListeners[listenerIndex] = listener;
		this.#eventsListeners[event] = eventListeners;

		return () => {
			this.#eventsListeners[event]?.splice(listenerIndex, 1);
		};
	}

	trigger<K extends keyof T>(event: K, ...args: T[K]): void {
		this.#eventsListeners[event]?.forEach((listener) => {
			listener(...args);
		});
	}
}
