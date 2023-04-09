import { faker } from '@faker-js/faker';
import Stripe from 'stripe';

describe('Mock SetupIntents Resource', () => {
	const stripe = new Stripe('test_key', {
		apiVersion: '2022-11-15',
	});

	let setupIntentId: string;
	let customer: Stripe.Customer;
	beforeAll(async () => {
		customer = await stripe.customers.create();
	});

	it('creates setup intents', async () => {
		const setupIntent = await stripe.setupIntents.create({
			customer: customer.id,
		});

		expect(setupIntent.id).toBeTruthy();
		expect(setupIntent.customer).toBe(customer.id);
		expect(setupIntent.status).toBe('processing');

		setupIntentId = setupIntent.id;
	});

	it('updates setup intents', async () => {
		const customerName = faker.name.fullName();

		const updated = await stripe.setupIntents.update(setupIntentId, {
			metadata: { customer_name: customerName },
		});

		expect(updated).toBeTruthy();
		expect(updated.metadata?.customer_name).toBe(customerName);
	});
});
