import {
	copy,
	equals,
} from '~/helpers';

describe('helpers/copy', () => {
	test('success', () => {
		const a = { propA: 1, propB: ['string'] };
		const b = copy(a);

		expect(b).toEqual(a);

		b.propB.push('string');

		expect(equals(a.propB, b.propB)).toBe(false);
	});
});
