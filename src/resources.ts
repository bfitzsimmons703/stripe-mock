import { IDatabase, PATH_SEPARATOR } from '@/db';

export enum Resource {
	Coupons = 'coupons',
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

	buildPath(parts: string[]): string {
		return parts.join(PATH_SEPARATOR);
	}
}
