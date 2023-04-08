import { faker } from '@faker-js/faker';
import { Config, JsonDB } from 'node-json-db';

import { MockCustomersResource } from '__mocks__/stripe/customers';
import { MockPaymentMethodsResource } from '__mocks__/stripe/payment-methods';
import { MockPricesResource } from '__mocks__/stripe/prices';
import { MockProductsResource } from '__mocks__/stripe/products';

// Each test runner gets its own database file because they run in parallel, isolated environments
const db = new JsonDB(
	new Config(
		`__mocks__/__data__/stripe-data-${faker.datatype.uuid()}`, // db filename
		true, // auto-save on `push`
		false, // don't need to make it human readable
		'/' // path separator when querying for data
	)
);

export default class MockStripe {
	customers = new MockCustomersResource(db);
	paymentMethods = new MockPaymentMethodsResource(db);
	products = new MockProductsResource(db);
	prices = new MockPricesResource(db);
}
