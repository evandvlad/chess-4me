import { assert } from "../assert";

describe("utils/assert", () => {
	it("value is satisfied assertion", () => {
		expect(() => {
			assert(true);
		}).not.to.throw();
	});

	it("value isn't satisfied assertion", () => {
		expect(() => {
			assert(false);
		}).to.throw("Assertion Error");
	});
});
