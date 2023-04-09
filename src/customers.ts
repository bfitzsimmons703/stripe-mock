/* eslint-disable @typescript-eslint/ban-ts-comment */
import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';
import Stripe from 'stripe';

import { stripeUUID } from '@/utils';
import { SUBSCRIPTIONS_DATA_PATH } from '@/subscriptions';
import { MockResource, Resource } from '@/resources';
import { IDatabase } from '@/db';

export const CUSTOMERS_DATA_PATH = '/customers';

export class MockCustomersResource extends MockResource {
	resource: Resource = Resource.Customers;

	constructor(db: IDatabase) {
		super(db);
	}

	async create(
		params: Stripe.CustomerCreateParams
	): Promise<Stripe.Customer> {
		const customer: Stripe.Customer = {
			id: `cus_${stripeUUID()}`,
			name: faker.name.fullName(),
			email: faker.internet.email(),
			invoice_settings: {
				//@ts-ignore
				default_payment_method: null,
			},
			created: DateTime.now().toUnixInteger(),
			subscriptions: undefined,

			...params,
		};

		await this.db.set(`${this.resource}.${customer.id}`, customer);

		return { ...customer };
	}

	async list(
		params: Pick<Stripe.CustomerListParams, 'email'>
	): Promise<Stripe.ApiList<Stripe.Customer>> {
		const customers: Stripe.Customer[] =
			(await this.db.findAll(
				this.resource,
				(entry: Partial<Stripe.Customer>) => {
					return entry.email === params.email;
				}
			)) || [];

		return {
			object: 'list',
			data: customers,
			has_more: false,
			url: '',
		} as unknown as Stripe.ApiList<Stripe.Customer>;
	}

	async update(
		id: string,
		params: Stripe.CustomerUpdateParams
	): Promise<Stripe.Customer> {
		const path = `${this.resource}.${id}`;

		const customer = await this.db.get(path);

		const updatedCustomer = {
			...customer,
			...params,
		} as Stripe.Customer;

		await this.db.set(path, updatedCustomer);

		return updatedCustomer;
	}

	async retrieve(
		id: string,
		params?: Stripe.CustomerRetrieveParams
	): Promise<Stripe.Customer> {
		const customer = (await this.db.get(
			`${this.resource}.${id}`
		)) as Stripe.Customer;

		if (params?.expand?.includes('subscriptions')) {
			const subscriptions: Stripe.Subscription[] =
				(await this.db.findAll(
					SUBSCRIPTIONS_DATA_PATH,
					(entry: Partial<Stripe.Subscription>) => {
						return entry.customer === id;
					}
				)) || [];

			customer.subscriptions = {
				object: 'list',
				has_more: false,
				data: subscriptions,
				url: '',
			};
		}

		return customer;
	}
}
