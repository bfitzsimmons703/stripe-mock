import Stripe from 'stripe';

describe('Mock PaymentMethods Resource', () => {
	const stripe = new Stripe('test_key', {
		apiVersion: '2022-11-15',
	});

	let paymentMethodId: string | undefined;

	it('can create a payment method', async () => {
		const pm = await stripe.paymentMethods.create({
			type: 'card',
		});

		expect(pm).toBeTruthy();
		expect(pm.type).toBe('card');

		paymentMethodId = pm.id;
	});

	it('can retrieve a payment method', async () => {
		const pm = await stripe.paymentMethods.retrieve(paymentMethodId!);
		expect(pm).toBeTruthy();
	});

	it('can retrieve a pre-made payment method', async () => {
		const pm = await stripe.paymentMethods.retrieve('pm_card_visa');
		expect(pm).toBeTruthy();
		expect(pm.type).toBe('card');
	});

	it('retrieving several test cards produces unique IDs', async () => {
		const pm1 = await stripe.paymentMethods.retrieve('pm_card_visa');
		const pm2 = await stripe.paymentMethods.retrieve('pm_card_visa');
		const pm3 = await stripe.paymentMethods.retrieve('pm_card_visa');

		expect(pm1).toBeTruthy();
		expect(pm2).toBeTruthy();
		expect(pm3).toBeTruthy();

		const ids = new Set([pm1.id, pm2.id, pm3.id]);
		expect(ids.size).toBe(3);
	});

	it('can attach a payment method to a customer', async () => {
		const customer = await stripe.customers.create();
		const paymentMethod = await stripe.paymentMethods.retrieve(
			'pm_card_visa'
		);

		await stripe.paymentMethods.attach(paymentMethod.id, {
			customer: customer.id,
		});

		const updatedCustomer = (await stripe.customers.retrieve(customer.id, {
			expand: ['sources'],
		})) as Stripe.Response<Stripe.Customer>;

		expect(updatedCustomer.default_source).toBe(paymentMethod.id);
		expect(updatedCustomer.sources?.data?.length).toBe(1);
		expect(updatedCustomer.sources?.data.at(0)?.id).toBe(paymentMethod.id);
	});
});
