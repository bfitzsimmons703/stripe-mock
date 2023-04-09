import { DatabaseType } from '@/db';
import MockStripe from '@/index';

MockStripe.enable({
	databaseType: DatabaseType.InMemory,
});
