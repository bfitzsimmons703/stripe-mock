import Stripe from 'stripe';
import { DateTime } from 'luxon';

import { IDatabase } from '@/db';
import { MockResource, Resource } from '@/resources';
import { stripeUUID } from '@/utils';

export class MockCouponsResource extends MockResource {
	resource: Resource = Resource.Coupons;

	constructor(db: IDatabase) {
		super(db);
	}

	async create(params: Stripe.CouponCreateParams): Promise<Stripe.Coupon> {
		if ('amount_off' in params && 'percent_off' in params) {
			throw new Error(
				'MockCouponsResource.create - both amount_off and percent_off specified.'
			);
		}

		let percentOff: number | null = null;

		if (!params.amount_off && !params.percent_off) {
			percentOff = 50;
		}

		//@ts-ignore
		const coupon: Stripe.Coupon = {
			id: `pm_${stripeUUID()}`,
			created: DateTime.now().toUnixInteger(),
			valid: true,
			percent_off: percentOff,

			...params,
		};

		const path = this.buildPath([this.resource, coupon.id]);
		await this.db.set(path, coupon);

		return { ...coupon };
	}
}
