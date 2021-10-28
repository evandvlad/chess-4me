import { cssClassNames } from "../dom";

describe("utils/dom", () => {
	describe("css-class-names", () => {
		it("null & empty strings are ignored", () => {
			const result = cssClassNames("a", null, "b", "c", "", "d");

			expect(result).to.equal("a b c d");
		});

		it("false values are ignored in record", () => {
			const result = cssClassNames("a", { b: true, c: false, d: false }, "e");

			expect(result).to.equal("a b e");
		});
	});
});
