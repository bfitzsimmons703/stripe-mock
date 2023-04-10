import Stripe from 'stripe';
import { DateTime } from 'luxon';

import { IDatabase } from '@/db';
import { MockResource, Resource } from '@/resources';
import { stripeUUID } from '@/utils';

export class MockSetupIntentsResource extends MockResource {
	resource: Resource = Resource.SetupIntents;

	constructor(db: IDatabase) {
		super(db);
	}

	async create(
		params: Stripe.SetupIntentCreateParams
	): Promise<Stripe.SetupIntent> {
		if (params.customer) {
			// check that customer exists, will throw error if not
			const path = this.buildPath([Resource.Customers, params.customer]);
			await this.db.get(path);
		}

		const setupIntent: Stripe.SetupIntent = {
			id: `seti_${stripeUUID()}`,
			created: DateTime.now().toUnixInteger(),
			status: 'processing',
			client_secret: stripeUUID(),

			...params,
		} as Stripe.SetupIntent;

		const path = this.buildPath([this.resource, setupIntent.id]);
		await this.db.set(path, setupIntent);

		return { ...setupIntent };
	}

	async update(
		id: string,
		params: Stripe.SetupIntentUpdateParams
	): Promise<Stripe.SetupIntent> {
		const path = this.buildPath([this.resource, id]);

		const setupIntent = (await this.db.get(path)) as Stripe.SetupIntent;

		const updatedIntent = {
			...setupIntent,
			...params,
		} as Stripe.SetupIntent;

		await this.db.set(path, updatedIntent);

		return updatedIntent;
	}
}
