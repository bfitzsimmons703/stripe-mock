import Stripe from 'stripe';

describe('Mock Prices Resource', () => {
	const stripe = new Stripe('test_key', {
		apiVersion: '2022-11-15',
	});

	let stripePriceId: string;
	it('creates prices', async () => {
		const nickname = 'myprice';

		const price = await stripe.prices.create({
			currency: 'usd',
			nickname,
		});

		expect(price).toBeTruthy();
		expect(price.nickname).toBe(nickname);

		stripePriceId = price.id;
	});

	it('retrieves prices', async () => {
		const price = await stripe.prices.retrieve(stripePriceId);
		expect(price).toBeTruthy();
		expect(price.id).toBe(stripePriceId);
	});
});
