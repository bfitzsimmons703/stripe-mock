import Stripe from 'stripe';

describe('Mock Coupons Resource', () => {
	const stripe = new Stripe('test_key', {
		apiVersion: '2022-11-15',
	});

	it('creates coupons', async () => {
		const coupon = await stripe.coupons.create({ percent_off: 20 });

		expect(coupon).toBeTruthy();
		expect(coupon.percent_off).toBe(20);
		expect(coupon.amount_off).toBeFalsy();
	});

	it('throws an error if both amount_off and percent_off are set', async () => {
		await expect(
			stripe.coupons.create({ amount_off: 100, percent_off: 100 })
		).rejects.toThrow();
	});
});
