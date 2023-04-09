/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import Stripe from 'stripe';
import { DateTime } from 'luxon';

import { stripeUUID } from '@/utils';
import { MockResource, Resource } from '@/resources';
import { IDatabase } from '@/db';

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
	pm_card_chargeCustomerFail: {
		//@ts-ignore
		card: {
			brand: 'visa',
			country: 'US',
			exp_month: DateTime.local().month,
			exp_year: DateTime.local().plus({ year: 1 }).year,
			last4: '0341',
		},
		created: DateTime.now().toUnixInteger(),
		type: 'card',
	},
};

export class MockPaymentMethodsResource extends MockResource {
	resource: Resource = Resource.PaymentMethods;

	constructor(db: IDatabase) {
		super(db);
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

		const path = this.buildPath([this.resource, paymentMethod.id]);
		await this.db.set(path, paymentMethod);

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

		const paymentMethodPath = this.buildPath([this.resource, id]);

		const customerPath = this.buildPath([
			Resource.Customers,
			params.customer,
		]);

		const customer = (await this.db.get(customerPath)) as Stripe.Customer;

		customer.default_source = paymentMethod.id;

		const sources: Stripe.ApiList<Stripe.CustomerSource> =
			customer.sources || {
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

		customer.sources = sources;

		await Promise.all([
			this.db.set(customerPath, customer),
			this.db.set(paymentMethodPath, paymentMethod),
		]);

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

		const path = this.buildPath([this.resource, id]);
		return this.db.get(path) as Promise<Stripe.PaymentMethod>;
	}
}
