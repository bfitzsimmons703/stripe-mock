import Stripe from 'stripe';

describe('Mock Subscriptions Resource', () => {
	const stripe = new Stripe('test_key', {
		apiVersion: '2022-11-15',
	});

	let subscriptionId: string;

	let customer: Stripe.Customer;
	beforeAll(async () => {
		customer = await stripe.customers.create();
	});

	it('creates subscriptions', async () => {
		const sub = await stripe.subscriptions.create({
			customer: customer.id,
		});

		expect(sub).toBeTruthy();
		expect(sub.customer).toBe(customer.id);

		subscriptionId = sub.id;
	});

	it('creating the subscription for a customer updates the customer object', async () => {
		const updatedCustomer = (await stripe.customers.retrieve(customer.id, {
			expand: ['subscriptions'],
		})) as Stripe.Customer;

		expect(updatedCustomer.subscriptions?.data).toBeTruthy();
		expect(updatedCustomer.subscriptions?.data.length).toBe(1);
		expect(updatedCustomer.subscriptions?.data.at(0)?.id).toBe(
			subscriptionId
		);
	});

	it('retrieves subscriptions', async () => {
		const sub = await stripe.subscriptions.retrieve(subscriptionId);
		expect(sub).toBeTruthy();
		expect(sub.id).toBe(subscriptionId);
	});

	it('updates subscriptions', async () => {
		const updated = await stripe.subscriptions.update(subscriptionId, {
			payment_settings: {
				save_default_payment_method: 'off',
			},
		});

		expect(updated.payment_settings?.save_default_payment_method).toBe(
			'off'
		);
	});
});
