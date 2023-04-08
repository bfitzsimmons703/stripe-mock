import { DateTime } from 'luxon';
import { JsonDB } from 'node-json-db';
import Stripe from 'stripe';
import { faker } from '@faker-js/faker';

import { stripeUUID } from '@/utils';

export const PRODUCTS_DATA_PATH = '/products';

export class MockProductsResource {
	private db: JsonDB;

	constructor(db: JsonDB) {
		this.db = db;
	}

	async create(params: Stripe.ProductCreateParams): Promise<Stripe.Product> {
		const product: Stripe.Product = {
			id: `prod_${stripeUUID()}`,
			description: faker.commerce.productDescription(),
			created: DateTime.now().toUnixInteger(),

			...params,
		} as Stripe.Product;

		await this.db.push(`${PRODUCTS_DATA_PATH}/${product.id}`, product);

		return { ...product };
	}

	async retrieve(id: string): Promise<Stripe.Product> {
		return this.db.getData(
			`${PRODUCTS_DATA_PATH}/${id}`
		) as Promise<Stripe.Product>;
	}
}
