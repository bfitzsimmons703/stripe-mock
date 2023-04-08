// THIS NEEDS TO BE IMPORTED FIRST
// Otherwise TypeScript path aliases fail (ie '@/db')
// See https://github.com/facebook/jest/issues/11644#issuecomment-1171646729
import 'tsconfig-paths/register';

import fs from 'node:fs/promises';
import path from 'node:path';

async function clearMockData() {
	const directory = '__mocks__/__data__';

	try {
		const files = await fs.readdir(directory);

		const unlinkPromises = files.map((file) =>
			fs.unlink(path.join(directory, file))
		);

		await Promise.all(unlinkPromises);
	} catch (error) {
		const errorCode = (error as { code?: string }).code || null;
		if (errorCode !== 'ENOENT') {
			throw error;
		}
	}
}

async function globalSetup() {
	await clearMockData();
}

export default globalSetup;
