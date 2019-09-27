import {
	equals,
} from '~/helpers';

describe('helpers/equals', () => {
	test('success', () => {
		const a = { propA: 1, propB: 'string', propC: ['string'], propD: { 'propD-1': 2 } };
		const b = { propA: 1, propB: 'string', propC: ['string'], propD: { 'propD-1': 2 } };

		expect(equals(a, b)).toBe(true);
	});

	test('failure', () => {
		const a = { propA: 1, propB: 'string', propC: ['string'], propD: { 'propD-1': 2 } };
		const b = { propA: 1, propB: 'string', propC: ['string'], propD: { 'propD-1': 3 } };

		expect(equals(a, b)).toBe(false);
	});
});
