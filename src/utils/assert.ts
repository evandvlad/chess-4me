class AssertionError extends Error {}

type AssertionResult = void | never;

function createAssertionMessage(innerMessage: string, externalMessage?: string) {
	if (!externalMessage) {
		return innerMessage;
	}

	return `${innerMessage}: ${externalMessage}`;
}

function assert(condition: boolean, messsage: string): AssertionResult {
	if (!condition) {
		throw new AssertionError(messsage);
	}
}

export function assertPositiveIntGreaterThanZero(value: number, message?: string): AssertionResult {
	assert(
		Number.isInteger(value) && value > 0,
		createAssertionMessage("Assert positive Int greater than zero error", message),
	);
}

export function assertTrue(value: boolean, message?: string): AssertionResult {
	assert(value, createAssertionMessage("Assert true", message));
}
