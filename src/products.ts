import { DateTime } from 'luxon';
import Stripe from 'stripe';
import { faker } from '@faker-js/faker';

import { stripeUUID } from '@/utils';
import { MockResource, Resource } from '@/resources';
import { IDatabase } from '@/db';

export class MockProductsResource extends MockResource {
	resource: Resource = Resource.Products;

	constructor(db: IDatabase) {
		super(db);
	}

	async create(params: Stripe.ProductCreateParams): Promise<Stripe.Product> {
		const product: Stripe.Product = {
			id: `prod_${stripeUUID()}`,
			description: faker.commerce.productDescription(),
			created: DateTime.now().toUnixInteger(),

			...params,
		} as Stripe.Product;

		const path = this.buildPath([this.resource, product.id]);
		await this.db.set(path, product);

		return { ...product };
	}

	async retrieve(id: string): Promise<Stripe.Product> {
		const path = this.buildPath([this.resource, id]);
		return this.db.get(path) as Promise<Stripe.Product>;
	}
}
