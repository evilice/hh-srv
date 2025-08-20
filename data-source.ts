import { DataSource } from 'typeorm';
// import { config } from 'dotenv';

// config(); load evn file

const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;

export default new DataSource({
  type: 'postgres',
  host: DB_HOST || 'localhost',
  port: DB_PORT ? parseInt(DB_PORT) : 5432,
  database: DB_DATABASE || 'hr',
  username: DB_USERNAME || 'postgres',
  password: DB_PASSWORD || 'qwepoi123',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
