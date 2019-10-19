import {
	Item,
} from '~/models';

export function serializeItem(item: Item): string {
	return JSON.stringify(item);
}

export function deserializeItem(value: string): Item | null {
	try {
		const item = JSON.parse(value);
		return item;
	}
	catch {
		return null;
	}
}
