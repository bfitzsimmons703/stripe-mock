import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';
import Stripe from 'stripe';

import { stripeUUID } from '@/utils';
import { MockResource, Resource } from '@/resources';
import { IDatabase } from '@/db';

export class MockSubscriptionsResource extends MockResource {
	resource: Resource = Resource.Subscriptions;

	constructor(db: IDatabase) {
		super(db);
	}

	async create(
		params: Stripe.SubscriptionCreateParams
	): Promise<Stripe.Subscription> {
		const subscription: Stripe.Subscription = {
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

		const path = this.buildPath([this.resource, subscription.id]);
		await this.db.set(path, subscription);

		return { ...subscription };
	}

	async update(
		id: string,
		params: Stripe.SubscriptionUpdateParams
	): Promise<Stripe.Subscription> {
		const path = this.buildPath([this.resource, id]);

		const subscription = (await this.db.get(path)) as Stripe.Subscription;

		const updatedSubscription = {
			...subscription,
			...params,
		} as Stripe.Subscription;

		await this.db.set(path, updatedSubscription);

		return updatedSubscription;
	}

	async retrieve(
		id: string,
		params?: Stripe.SubscriptionRetrieveParams
	): Promise<Stripe.Subscription> {
		const subscriptionPath = this.buildPath([this.resource, id]);
		const subscription = (await this.db.get(
			subscriptionPath
		)) as Stripe.Subscription;

		if (params?.expand?.includes('schedule') && subscription.schedule) {
			const schedulePath = this.buildPath([
				Resource.SubscriptionSchedules,
				subscription.schedule as string,
			]);

			const schedule = await this.db.get(schedulePath);

			subscription.schedule = schedule;
		}

		return { ...subscription };
	}
}
