import { DateTime } from 'luxon';
import { JsonDB } from 'node-json-db';
import Stripe from 'stripe';
import { faker } from '@faker-js/faker';

import { stripeUUID } from '@/utils';

export const PRICES_DATA_PATH = '/prices';

export class MockPricesResource {
	private db: JsonDB;

	constructor(db: JsonDB) {
		this.db = db;
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

		await this.db.push(`${PRICES_DATA_PATH}/${price.id}`, price);

		return { ...price };
	}

	async retrieve(id: string): Promise<Stripe.Price> {
		return this.db.getData(
			`${PRICES_DATA_PATH}/${id}`
		) as Promise<Stripe.Price>;
	}
}
