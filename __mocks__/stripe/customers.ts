/* eslint-disable @typescript-eslint/ban-ts-comment */
import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';
import Stripe from 'stripe';
import { JsonDB } from 'node-json-db';

import { stripeUUID } from '__mocks__/stripe/utils';

export const CUSTOMERS_DATA_PATH = '/customers';

export class MockCustomersResource {
	private db: JsonDB;

	constructor(db: JsonDB) {
		this.db = db;
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

		await this.db.push(`${CUSTOMERS_DATA_PATH}/${customer.id}`, customer);

		return { ...customer };
	}

	async list(
		params: Pick<Stripe.CustomerListParams, 'email'>
	): Promise<Stripe.ApiList<Stripe.Customer>> {
		const customers: Stripe.Customer[] =
			(await this.db.filter(
				CUSTOMERS_DATA_PATH,
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
		const path = `${CUSTOMERS_DATA_PATH}/${id}`;

		await this.db.push(
			path,
			{
				...params,
			},
			false // don't override, merge
		);

		return this.db.getData(path) as Promise<Stripe.Customer>;
	}

	/**
	 * Don't need to worry about Stripe.CustomerRetrieveParams (which has the `expand` option)
	 * because we'll auto-expand every customer property by default.
	 */
	async retrieve(id: string): Promise<Stripe.Customer> {
		return this.db.getData(
			`${CUSTOMERS_DATA_PATH}/${id}`
		) as Promise<Stripe.Customer>;
	}
}
