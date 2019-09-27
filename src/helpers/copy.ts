export function copy<T extends any>(a: T): T {
	return JSON.parse(JSON.stringify(a));
}
