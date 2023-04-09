import { faker } from '@faker-js/faker';
import { Config, JsonDB } from 'node-json-db';

import { MockCustomersResource } from '@/customers';
import { MockPaymentMethodsResource } from '@/payment-methods';
import { MockPricesResource } from '@/prices';
import { MockProductsResource } from '@/products';
import { MockSubscriptionSchedulesResource } from '@/subscription-schedules';
import { MockSubscriptionsResource } from '@/subscriptions';
import { DatabaseFactory, DatabaseType } from '@/db';

// Each test runner gets its own database file because they run in parallel, isolated environments
const db = new JsonDB(
	new Config(
		`__mocks__/__data__/stripe-data-${faker.datatype.uuid()}`, // db filename
		true, // auto-save on `push`
		false, // don't need to make it human readable
		'/' // path separator when querying for data
	)
);

const _db = DatabaseFactory.build({ type: DatabaseType.InMemory });

export default class MockStripe {
	customers = new MockCustomersResource(_db);
	paymentMethods = new MockPaymentMethodsResource(db);
	products = new MockProductsResource(db);
	prices = new MockPricesResource(db);
	subscriptions = new MockSubscriptionsResource(db);
	subscriptionSchedules = new MockSubscriptionSchedulesResource(db);
}
