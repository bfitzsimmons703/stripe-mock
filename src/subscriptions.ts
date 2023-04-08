import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';
import { JsonDB } from 'node-json-db';
import Stripe from 'stripe';

import { stripeUUID } from '@/utils';
import { SUBSCRIPTION_SCHEDULES_DATA_PATH } from '@/subscription-schedules';

export const SUBSCRIPTIONS_DATA_PATH = '/subscriptions';

export class MockSubscriptionsResource {
	private db: JsonDB;

	constructor(db: JsonDB) {
		this.db = db;
	}

	async create(
		params: Stripe.SubscriptionCreateParams
	): Promise<Stripe.Subscription> {
		const sub: Stripe.Subscription = {
			id: `sub_${stripeUUID()}`,
			cancel_at_period_end: faker.datatype.boolean(),
			created: DateTime.now().toUnixInteger(),
			start_date: DateTime.now().toUnixInteger(),
			collection_method: 'charge_automatically',
			currency: 'usd',
			current_period_start: DateTime.now().toUnixInteger(),
			current_period_end: DateTime.now()
				.plus({ year: 1 })
				.toUnixInteger(),
			status: 'active',
			//@ts-ignore
			items: {
				object: 'list',
				data: [{ price: `price_${stripeUUID()}` }],
				has_more: false,
				url: '',
			},

			...params,
		};

		await this.db.push(`${SUBSCRIPTIONS_DATA_PATH}/${sub.id}`, sub);

		return { ...sub };
	}

	async update(
		id: string,
		params: Stripe.SubscriptionUpdateParams
	): Promise<Stripe.Subscription> {
		const path = `${SUBSCRIPTIONS_DATA_PATH}/${id}`;

		await this.db.push(
			path,
			{
				...params,
			},
			false // don't override, merge
		);

		return this.db.getData(path) as Promise<Stripe.Subscription>;
	}

	async retrieve(
		id: string,
		params?: Stripe.SubscriptionRetrieveParams
	): Promise<Stripe.Subscription> {
		const subscription = (await this.db.getData(
			`${SUBSCRIPTIONS_DATA_PATH}/${id}`
		)) as Stripe.Subscription;

		if (params?.expand?.includes('schedule') && subscription.schedule) {
			const schedule = await this.db.getData(
				`${SUBSCRIPTION_SCHEDULES_DATA_PATH}/${subscription.schedule}`
			);

			subscription.schedule = schedule;
		}

		return { ...subscription };
	}
}
