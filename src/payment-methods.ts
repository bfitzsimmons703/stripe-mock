/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import Stripe from 'stripe';
import { JsonDB } from 'node-json-db';
import { DateTime } from 'luxon';

import { CUSTOMERS_DATA_PATH } from '@/customers';
import { stripeUUID } from '@/utils';

export const PAYMENT_METHODS_DATA_PATH = '/paymentMethods';

const TEST_CARDS: Record<string, Stripe.PaymentMethod> = {
	pm_card_visa: {
		//@ts-ignore
		card: {
			brand: 'visa',
			country: 'US',
			exp_month: DateTime.local().month,
			exp_year: DateTime.local().plus({ year: 1 }).year,
			last4: '4242',
		},
		created: DateTime.now().toUnixInteger(),
		type: 'card',
	},
};

export class MockPaymentMethodsResource {
	private db: JsonDB;

	constructor(db: JsonDB) {
		this.db = db;
	}

	async create(
		params: Stripe.PaymentMethodCreateParams
	): Promise<Stripe.PaymentMethod> {
		//@ts-ignore
		const paymentMethod: Stripe.PaymentMethod = {
			id: `pm_${stripeUUID()}`,
			created: DateTime.now().toUnixInteger(),

			...params,
		};

		await this.db.push(
			`${PAYMENT_METHODS_DATA_PATH}/${paymentMethod.id}`,
			paymentMethod
		);

		return { ...paymentMethod };
	}

	async attach(
		id: string,
		params: Stripe.PaymentMethodAttachParams
	): Promise<Stripe.PaymentMethod> {
		if (!params.customer) {
			throw new Error(
				'MockPaymentMethodsResource.attach missing params.customer'
			);
		}

		//@ts-ignore
		const paymentMethod: Stripe.PaymentMethod = {
			id,
			customer: params.customer,
		};

		const cus = (await this.db.getData(
			`${CUSTOMERS_DATA_PATH}/${params.customer}`
		)) as Stripe.Customer;

		cus.default_source = paymentMethod.id;

		const sources: Stripe.ApiList<Stripe.CustomerSource> = cus.sources || {
			object: 'list',
			has_more: false,
			url: '',
			data: [],
		};

		const alreadyHasPaymentMethod = sources.data.find(
			(source) => source.id === paymentMethod.id
		);

		if (!alreadyHasPaymentMethod) {
			//@ts-ignore
			sources.data.push(paymentMethod);
		}

		cus.sources = sources;

		await this.db.push(
			`${CUSTOMERS_DATA_PATH}/${params.customer}`,
			cus,
			true
		);

		await this.db.push(`${PAYMENT_METHODS_DATA_PATH}/${id}`, paymentMethod);

		return paymentMethod;
	}

	async retrieve(id: string): Promise<Stripe.PaymentMethod> {
		if (TEST_CARDS[id]) {
			const testCard = TEST_CARDS[id]!;

			// Will give us a unique pm_XXX id each time, which is how Stripe handles test cards
			return this.create({
				...testCard,
			} as Stripe.PaymentMethodCreateParams);
		}

		return this.db.getData(
			`${PAYMENT_METHODS_DATA_PATH}/${id}`
		) as Promise<Stripe.PaymentMethod>;
	}
}
