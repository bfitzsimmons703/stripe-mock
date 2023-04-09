import { DatabaseType } from '@/db';
import MockStripe from '@/index';

const databaseType: DatabaseType =
	process.env.DB_TYPE === 'json'
		? DatabaseType.JsonFile
		: DatabaseType.InMemory;

MockStripe.enable({
	databaseType,
});
