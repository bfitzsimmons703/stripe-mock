import { DateTime } from 'luxon';
import Stripe from 'stripe';
import { faker } from '@faker-js/faker';

import { stripeUUID } from '@/utils';
import { MockResource, Resource } from '@/resources';
import { IDatabase } from '@/db';

export class MockPricesResource extends MockResource {
	resource: Resource = Resource.Prices;

	constructor(db: IDatabase) {
		super(db);
	}

	async create(params: Stripe.PriceCreateParams): Promise<Stripe.Price> {
		const price: Stripe.Price = {
			id: `price_${stripeUUID()}`,
			nickname: faker.commerce.productDescription(),
			created: DateTime.now().toUnixInteger(),
			product: `prod_${stripeUUID()}`,
			recurring: {
				interval: faker.helpers.arrayElement([
					'day',
					'month',
					'year',
					'week',
				]),
				//@ts-ignore
				interval_count: faker.datatype.number({
					min: 1,
					max: 5,
				}),
			},

			...params,
		};

		const path = this.buildPath([this.resource, price.id]);
		await this.db.set(path, price);

		return { ...price };
	}

	async retrieve(id: string): Promise<Stripe.Price> {
		const path = this.buildPath([this.resource, id]);
		return this.db.get(path) as Promise<Stripe.Price>;
	}
}
