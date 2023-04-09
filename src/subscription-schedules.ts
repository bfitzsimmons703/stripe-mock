import { DateTime } from 'luxon';
import Stripe from 'stripe';

import { stripeUUID } from '@/utils';
import { MockResource, Resource } from '@/resources';
import { IDatabase } from '@/db';

export class MockSubscriptionSchedulesResource extends MockResource {
	resource: Resource = Resource.SubscriptionSchedules;

	constructor(db: IDatabase) {
		super(db);
	}

	async create(
		params: Pick<
			Stripe.SubscriptionScheduleCreateParams,
			'from_subscription'
		>
	): Promise<Stripe.SubscriptionSchedule> {
		const subscriptionPath = this.buildPath([
			Resource.Subscriptions,
			params.from_subscription!,
		]);

		const subscription = (await this.db.get(
			subscriptionPath
		)) as Stripe.Subscription;

		const subscriptionItems = subscription.items.data;

		const schedule: Stripe.SubscriptionSchedule = {
			id: `sub_sched_${stripeUUID()}`,
			created: DateTime.now().toUnixInteger(),
			subscription: subscription.id,
			customer: subscription.customer,
			end_behavior: 'release',
			current_phase: {
				start_date: subscription.current_period_start,
				end_date: subscription.current_period_end,
			},
			//@ts-ignore
			phases: subscriptionItems.map((item) => ({
				items: [{ price: item.price.id }],
			})),
		};

		subscription.schedule = schedule.id;

		const schedulePath = this.buildPath([this.resource, schedule.id]);
		await Promise.all([
			this.db.set(schedulePath, schedule),
			this.db.set(
				this.buildPath([Resource.Subscriptions, subscription.id]),
				subscription
			),
		]);

		await this.db.set(schedulePath, schedule);

		return { ...schedule };
	}

	async update(
		id: string,
		params: Stripe.SubscriptionUpdateParams
	): Promise<Stripe.SubscriptionSchedule> {
		const path = this.buildPath([this.resource, id]);

		const schedule = (await this.db.get(
			path
		)) as Stripe.SubscriptionSchedule;

		const updatedSchedule = {
			...schedule,
			...params,
		} as Stripe.SubscriptionSchedule;

		await this.db.set(path, updatedSchedule);

		return updatedSchedule;
	}
}
