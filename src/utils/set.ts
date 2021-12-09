export function hasOnly<T>(set: ReadonlySet<T>, value: T) {
	return set.has(value) && set.size === 1;
}
