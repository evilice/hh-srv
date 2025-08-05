import { DataSource } from 'typeorm';
// import { config } from 'dotenv';

// config(); load evn file

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'hr',
  username: 'postgres',
  password: 'qwepoi123',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
