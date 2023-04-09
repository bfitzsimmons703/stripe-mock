import { DatabaseFactory, DatabaseType } from '@/db';
import { MockResource } from '@/resources';

import { MockCustomersResource } from '@/customers';
import { MockPaymentMethodsResource } from '@/payment-methods';
import { MockPricesResource } from '@/prices';
import { MockProductsResource } from '@/products';
import { MockSubscriptionSchedulesResource } from '@/subscription-schedules';
import { MockSubscriptionsResource } from '@/subscriptions';
import { MockCouponsResource } from '@/coupons';
import { MockSetupIntentsResource } from '@/setup-intents';
import { MockWebhooksResource } from '@/webhooks';

interface MockStripeConfig {
	databaseType: DatabaseType;
}

export default class MockStripe {
	private static databaseType: DatabaseType;

	coupons: MockResource;
	customers: MockResource;
	paymentMethods: MockResource;
	products: MockResource;
	prices: MockResource;
	setupIntents: MockResource;
	subscriptions: MockResource;
	subscriptionSchedules: MockResource;
	webhooks: MockResource;

	constructor() {
		const db = DatabaseFactory.build({ type: MockStripe.databaseType });

		this.coupons = new MockCouponsResource(db);
		this.customers = new MockCustomersResource(db);
		this.paymentMethods = new MockPaymentMethodsResource(db);
		this.products = new MockProductsResource(db);
		this.prices = new MockPricesResource(db);
		this.setupIntents = new MockSetupIntentsResource(db);
		this.subscriptions = new MockSubscriptionsResource(db);
		this.subscriptionSchedules = new MockSubscriptionSchedulesResource(db);
		this.webhooks = new MockWebhooksResource(db);
	}

	static enable(config: MockStripeConfig) {
		MockStripe.databaseType = config.databaseType;
		jest.setMock('stripe', MockStripe);
	}
}
