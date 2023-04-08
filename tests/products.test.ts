import { faker } from '@faker-js/faker';
import Stripe from 'stripe';

describe('Mock Products Resource', () => {
	const stripe = new Stripe('test_key', {
		apiVersion: '2022-11-15',
	});

	const productName = faker.commerce.productName();

	let productId: string;
	it('creates a product', async () => {
		const product = await stripe.products.create({
			name: productName,
		});

		expect(product).toBeTruthy();
		expect(product.name).toBe(productName);

		productId = product.id;
	});

	it('retrieves that product', async () => {
		const product = await stripe.products.retrieve(productId);
		expect(product).toBeTruthy();
		expect(product.id).toBe(productId);
	});
});
