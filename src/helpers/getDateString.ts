export function getDateString(date: Date): string {
	return date.toISOString().substr(0, 10);
}
