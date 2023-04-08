import { DateTime } from 'luxon';
import { JsonDB } from 'node-json-db';
import Stripe from 'stripe';

import { SUBSCRIPTIONS_DATA_PATH } from '@/subscriptions';
import { stripeUUID } from '@/utils';

export const SUBSCRIPTION_SCHEDULES_DATA_PATH = '/subscriptionSchedules';

export class MockSubscriptionSchedulesResource {
	private db: JsonDB;

	constructor(db: JsonDB) {
		this.db = db;
	}

	async create(
		params: Pick<
			Stripe.SubscriptionScheduleCreateParams,
			'from_subscription'
		>
	): Promise<Stripe.SubscriptionSchedule> {
		const sub = (await this.db.getData(
			`${SUBSCRIPTIONS_DATA_PATH}/${params.from_subscription}`
		)) as Stripe.Subscription;

		const subscriptionItems = sub.items.data;

		const schedule: Stripe.SubscriptionSchedule = {
			id: `sub_sched_${stripeUUID()}`,
			created: DateTime.now().toUnixInteger(),
			subscription: sub.id,
			customer: sub.customer,
			end_behavior: 'release',
			current_phase: {
				start_date: sub.current_period_start,
				end_date: sub.current_period_end,
			},
			//@ts-ignore
			phases: subscriptionItems.map((item) => ({
				items: [{ price: item.price.id }],
			})),
		};

		await Promise.all([
			this.db.push(
				`${SUBSCRIPTION_SCHEDULES_DATA_PATH}/${schedule.id}`,
				schedule
			),
			this.db.push(
				`${SUBSCRIPTIONS_DATA_PATH}/${sub.id}`,
				{ schedule: schedule.id },
				false
			),
		]);

		await this.db.push(
			`${SUBSCRIPTION_SCHEDULES_DATA_PATH}/${schedule.id}`,
			schedule
		);

		return { ...schedule };
	}

	async update(
		id: string,
		params: Stripe.SubscriptionUpdateParams
	): Promise<Stripe.SubscriptionSchedule> {
		const path = `${SUBSCRIPTION_SCHEDULES_DATA_PATH}/${id}`;

		await this.db.push(
			path,
			{
				...params,
			},
			false
		);

		return this.db.getData(path) as Promise<Stripe.SubscriptionSchedule>;
	}
}
