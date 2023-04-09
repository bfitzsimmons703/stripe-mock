import Stripe from 'stripe';

describe('Mock Webhooks Resource', () => {
	const stripe = new Stripe('test_key', {
		apiVersion: '2022-11-15',
	});

	it('constructs webhook events', () => {
		const json = JSON.stringify({ id: 1, type: 'invoice.created' });

		const event = stripe.webhooks.constructEvent(
			json,
			'fake-sig',
			'webhook-secret'
		);

		expect(event.id).toBeTruthy();
		expect(event.type).toBe('invoice.created');
	});

	it('generates test header strings', () => {
		const header = stripe.webhooks.generateTestHeaderString({
			payload: '{id: 1}',
			secret: 'secret',
		});

		expect(header).toBeTruthy();
		expect(typeof header).toBe('string');
	});
});
