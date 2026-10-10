import dotenv from 'dotenv';

dotenv.config({ path: '.env.test', override: true });

if (!process.env.DATABASE_URL?.includes('_test')) {
	throw new Error('Тесты должны работать только с тестовой базой (в имени должно быть _test)');
}