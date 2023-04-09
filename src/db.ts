import { faker } from '@faker-js/faker';
import { Config, JsonDB } from 'node-json-db';
import set from 'lodash/set';
import get from 'lodash/get';

type FindCallback = (entry: any, index: number | string) => boolean;

export interface IDatabase {
	set(path: string, data: any): Promise<void>;
	get(path: string): Promise<any>;
	findAll(path: string, findCallback: FindCallback): Promise<any[]>;
}

export enum DatabaseType {
	JsonFile,
	InMemory,
}

export const PATH_SEPARATOR = '.';

class JsonFileDatabase implements IDatabase {
	private db: JsonDB;

	constructor() {
		const db = new JsonDB(
			new Config(
				`__mocks__/__data__/stripe-data-${faker.datatype.uuid()}`, // db filename
				true, // auto-save on `push`
				false, // don't need to make it human readable
				PATH_SEPARATOR // path separator when querying for data
			)
		);

		this.db = db;
	}

	async set(path: string, data: any): Promise<void> {
		await this.db.push(path, data);
	}

	async get(path: string): Promise<any> {
		return this.db.getData(path);
	}

	async findAll(path: string, findCallback: FindCallback): Promise<any[]> {
		const results = await this.db.filter(path, findCallback);
		return results || [];
	}
}

class InMemoryDatabase implements IDatabase {
	private map: Record<string, unknown> = {};

	set(path: string, data: any): Promise<void> {
		set(this.map, path, data);
		return Promise.resolve();
	}

	get(path: string): Promise<any> {
		return Promise.resolve(get(this.map, path));
	}

	findAll(path: string, findCallback: FindCallback): Promise<any[]> {
		const data = get(this.map, path);

		if (!data) return Promise.resolve([]);

		const results = Object.values(data).filter(findCallback);

		return Promise.resolve(results);
	}
}

interface DatabaseFactoryConfig {
	type: DatabaseType;
}

export class DatabaseFactory {
	static build(config: DatabaseFactoryConfig): IDatabase {
		switch (config.type) {
			case DatabaseType.JsonFile:
				return new JsonFileDatabase();
			case DatabaseType.InMemory:
				return new InMemoryDatabase();
			default:
				throw new Error('Unknown Mock Stripe DatabaseType');
		}
	}
}
