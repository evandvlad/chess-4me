import { uniq, hasIndex } from "../array";

describe("array", () => {
	describe("uniq", () => {
		it("simple values", () => {
			expect(uniq([1, 1, 2, 1])).eql([1, 2]);
		});

		it("complex cases", () => {
			const a = { a: 1 };
			const b = { b: 1 };

			expect(uniq([a, b, a, b, b])).eql([a, b]);
		});
	});

	describe("has index", () => {
		it("false if index isn't integer", () => {
			expect(hasIndex([1], 0.5)).equal(false);
		});

		it("false if index is negative", () => {
			expect(hasIndex([1], -1)).equal(false);
		});

		it("false if index isn't finite", () => {
			expect(hasIndex([1], NaN)).equal(false);
			expect(hasIndex([1], Infinity)).equal(false);
		});

		it("false if index too high", () => {
			expect(hasIndex([], 0)).equal(false);
			expect(hasIndex([1], 1)).equal(false);
			expect(hasIndex([1], 12)).equal(false);
		});

		it("true", () => {
			expect(hasIndex(["test", "rest"], 0)).equal(true);
		});
	});
});
