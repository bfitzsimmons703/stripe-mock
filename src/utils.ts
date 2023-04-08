import { faker } from '@faker-js/faker';

// Stripe's UUIDs don't have hyphens
export const stripeUUID = () => {
	const searchRegExp = /-/g;
	const replaceWith = '';
	return faker.datatype.uuid().replace(searchRegExp, replaceWith);
};
