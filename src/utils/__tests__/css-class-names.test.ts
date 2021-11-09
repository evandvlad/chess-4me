import { cssClassNames } from "../css-class-names";

describe("utils/css-class-names", () => {
	it("null, undefined & empty strings are ignored", () => {
		const result = cssClassNames("a", null, "b", undefined, "c", "", "d");

		expect(result).to.equal("a b c d");
	});

	it("false values are ignored in record", () => {
		const result = cssClassNames("a", { b: true, c: false, d: false }, "e");

		expect(result).to.equal("a b e");
	});
});
