export type OptionalValue<T> = T | null;

export type OptionalValueBox<T> = { value: OptionalValue<T> };

export function optionalValueBox<T>(value: OptionalValue<T>): OptionalValueBox<T> {
	return { value };
}
