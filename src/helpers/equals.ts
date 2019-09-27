export function equals<T extends any>(a: T, b: T): boolean {
	return JSON.stringify(a) === JSON.stringify(b);
}
