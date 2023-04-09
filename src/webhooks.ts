import { faker } from '@faker-js/faker';
import Stripe from 'stripe';

import { MockResource, Resource } from '@/resources';
import { stripeUUID } from '@/utils';

export class MockWebhooksResource extends MockResource {
	resource: Resource = Resource.Webhooks;

	constructEvent(rawPayload: string): Stripe.Event {
		const payload = JSON.parse(rawPayload);

		const event: Stripe.Event = {
			id: `evt_${stripeUUID()}`,
			...payload,
		};

		return event;
	}

	generateTestHeaderString(_params: { payload: string }): string {
		return faker.random.alphaNumeric(8);
	}
}
