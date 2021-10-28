export function cssClassNames(...args: Array<string | null | Record<string, boolean>>): string {
	return args
		.flatMap((val) => {
			if (!val) {
				return [];
			}

			if (typeof val === "string") {
				return [val];
			}

			return Object.entries(val)
				.filter(([, val]) => val)
				.map(([key]) => key);
		})
		.join(" ");
}
