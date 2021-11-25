import type { Coordinate, Path } from "../board";

import { lookupCoordinate } from "../board";

export interface ScanDirection {
	readonly path: Path;
	readonly iterateOnce: boolean;
}

export interface ScanStep {
	readonly coordinate: Coordinate;
	readonly direction: ScanDirection;
	readonly iterations: number;
}

export class BoardScanner {
	readonly #stoppedScanPaths = new Set<Path>();
	#steps: ScanStep[];

	constructor(coordinate: Coordinate, directions: ScanDirection[]) {
		this.#steps = directions.map((direction) => ({
			direction,
			coordinate,
			iterations: 0,
		}));
	}

	next() {
		let nextStep: ScanStep | null = null;
		const steps = [...this.#steps];

		while (steps.length) {
			nextStep = this.#scan(steps.shift()!);

			if (nextStep) {
				steps.push(nextStep);
				break;
			}
		}

		this.#steps = steps;

		return nextStep;
	}

	stopScanPath(path: Path) {
		this.#stoppedScanPaths.add(path);
	}

	#scan(currentStep: ScanStep): ScanStep | null {
		const currentStepPath = currentStep.direction.path;

		if (this.#stoppedScanPaths.has(currentStepPath)) {
			return null;
		}

		if (currentStep.direction.iterateOnce && currentStep.iterations === 1) {
			return null;
		}

		const coordinate = lookupCoordinate(currentStep.coordinate, currentStepPath);

		return coordinate ? this.#createNextStep(coordinate, currentStep) : null;
	}

	#createNextStep(coordinate: Coordinate, currentStep: ScanStep): ScanStep {
		return { ...currentStep, coordinate, iterations: currentStep.iterations + 1 };
	}
}
