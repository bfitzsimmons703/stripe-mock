import { MockCustomersResource } from '@/customers';
import { MockPaymentMethodsResource } from '@/payment-methods';
import { MockPricesResource } from '@/prices';
import { MockProductsResource } from '@/products';
import { MockSubscriptionSchedulesResource } from '@/subscription-schedules';
import { MockSubscriptionsResource } from '@/subscriptions';
import { DatabaseFactory, DatabaseType } from '@/db';

const db = DatabaseFactory.build({ type: DatabaseType.JsonFile });

export default class MockStripe {
	customers = new MockCustomersResource(db);
	paymentMethods = new MockPaymentMethodsResource(db);
	products = new MockProductsResource(db);
	prices = new MockPricesResource(db);
	subscriptions = new MockSubscriptionsResource(db);
	subscriptionSchedules = new MockSubscriptionSchedulesResource(db);
}
