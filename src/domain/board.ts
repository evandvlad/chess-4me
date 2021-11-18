type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

const ranks: ReadonlyArray<Rank> = ["1", "2", "3", "4", "5", "6", "7", "8"];
const files: ReadonlyArray<File> = ["a", "b", "c", "d", "e", "f", "g", "h"];

export type Coordinate = `${File}${Rank}`;

export const coordinates: ReadonlyArray<Coordinate> = files.flatMap((file) =>
	ranks.map<Coordinate>((rank) => `${file}${rank}`),
);
