import { hasOnly } from "../set";

describe("set", () => {
	describe("has only", () => {
		it("false if value isn't in set", () => {
			expect(hasOnly(new Set(["a", "b"]), "c")).equal(false);
		});

		it("false if has other values", () => {
			expect(hasOnly(new Set(["a", "b"]), "b")).equal(false);
		});

		it("false for empty set", () => {
			expect(hasOnly(new Set([]), "b")).equal(false);
		});

		it("false if complex value has other link", () => {
			expect(hasOnly(new Set([{ a: 1 }]), { a: 1 })).equal(false);
		});

		it("true for simple value", () => {
			expect(hasOnly(new Set(["test"]), "test")).equal(true);
		});

		it("true for complex value", () => {
			const value = { a: 1, b: 45 };
			expect(hasOnly(new Set([value]), value)).equal(true);
		});
	});
});
