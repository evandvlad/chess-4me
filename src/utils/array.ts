export function uniq<T>(array: ReadonlyArray<T>) {
	return [...new Set(array)];
}

export function hasIndex<T>(array: ReadonlyArray<T>, index: number) {
	return Number.isInteger(index) && index >= 0 && index < array.length;
}
