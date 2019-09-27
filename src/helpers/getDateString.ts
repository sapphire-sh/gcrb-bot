export function getDateString(date: Date, dateDiff?: number): string {
	const nextDate = new Date(date);
	if (dateDiff !== undefined) {
		nextDate.setDate(nextDate.getDate() + dateDiff);
	}
	return nextDate.toISOString().substr(0, 10);
}
