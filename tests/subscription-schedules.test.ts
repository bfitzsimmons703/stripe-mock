import Stripe from 'stripe';

describe('Mock Subscription Schedules Resource', () => {
	const stripe = new Stripe('test_key', {
		apiVersion: '2022-11-15',
	});

	let customer: Stripe.Customer;
	let subscription: Stripe.Subscription;
	beforeAll(async () => {
		customer = await stripe.customers.create();
		subscription = await stripe.subscriptions.create({
			customer: customer.id,
		});
	});

	it('creates subscription schedules', async () => {
		const sched = await stripe.subscriptionSchedules.create({
			from_subscription: subscription.id,
		});

		expect(sched).toBeTruthy();
		expect(sched.customer).toBe(customer.id);
		expect(sched.subscription).toBe(subscription.id);

		expect(sched.phases.length).toBe(1);
	});
});
