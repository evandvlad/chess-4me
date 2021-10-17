import { assertPositiveIntGreaterThanZero, assertTrue } from "../assert";

describe("utils/assert", () => {
	describe("assert positive int greater than zero", () => {
		[0, NaN, Infinity, -Infinity, -6, 1.000001, -0].forEach((value) => {
			it(`value ${value} isn't satisfied assertion`, () => {
				expect(() => {
					assertPositiveIntGreaterThanZero(value);
				}).to.throw();
			});
		});

		[1, 100, 5.0].forEach((value) => {
			it(`value ${value} is satisfied assertion`, () => {
				expect(() => {
					assertPositiveIntGreaterThanZero(value);
				}).not.to.throw();
			});
		});
	});

	describe("assert true", () => {
		it("value is satisfied assertion", () => {
			expect(() => {
				assertTrue(true);
			}).not.to.throw();
		});

		it("value isn't satisfied assertion", () => {
			expect(() => {
				assertTrue(false);
			}).to.throw();
		});
	});
});
