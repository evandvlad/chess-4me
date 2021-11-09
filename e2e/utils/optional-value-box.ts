export type OptionalValueBox<T> = { value: T | null };

export function optionalValueBox<T>(value: T | null): OptionalValueBox<T> {
	return { value };
}
