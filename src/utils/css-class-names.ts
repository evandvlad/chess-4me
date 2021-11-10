export function cssClassNames(...args: Array<string | null | undefined | Record<string, boolean>>) {
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
