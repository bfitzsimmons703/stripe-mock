import { IDatabase } from '@/db';

export enum Resource {
	Customers = 'customers',
	PaymentMethods = 'paymentMethods',
	Prices = 'prices',
	Products = 'products',
	Subscriptions = 'subscriptions',
	SubscriptionSchedules = 'subscriptionSchedules',
}

export abstract class MockResource {
	abstract resource: Resource;

	protected db: IDatabase;

	constructor(db: IDatabase) {
		this.db = db;
	}
}
