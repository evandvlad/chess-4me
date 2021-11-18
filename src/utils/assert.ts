class AssertionError extends Error {}

export function assert(value: boolean, message?: string) {
	if (!value) {
		throw new AssertionError(message ?? "Assertion Error");
	}
}
