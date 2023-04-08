import { faker } from '@faker-js/faker';
import Stripe from 'stripe';

describe('Mock Customers Resource', () => {
	const stripe = new Stripe('test_key', {
		apiVersion: '2022-11-15',
	});

	const stripeCustomerEmail = faker.internet.email();
	let stripeCustomerId: string;

	it('creates customers', async () => {
		const customer = await stripe.customers.create({
			email: stripeCustomerEmail,
		});

		expect(customer.id).toBeTruthy();
		expect(customer.email).toBe(stripeCustomerEmail);

		stripeCustomerId = customer.id;
	});

	it('lists customers', async () => {
		const results = await stripe.customers.list({
			email: stripeCustomerEmail,
		});

		expect(results.data.length).toBe(1);

		const [customer] = results.data;
		expect(customer).toBeTruthy();
		expect(customer?.email).toBe(stripeCustomerEmail);
	});

	it('retrieves and updates customers', async () => {
		const customer = await stripe.customers.retrieve(stripeCustomerId);
		expect(customer).toBeTruthy();

		const paymentMethod = 'testPM';

		const updatedCustomer = await stripe.customers.update(
			stripeCustomerId,
			{
				invoice_settings: {
					default_payment_method: paymentMethod,
				},
			}
		);

		expect(updatedCustomer.invoice_settings.default_payment_method).toBe(
			paymentMethod
		);
	});
});
