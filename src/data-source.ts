import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.db_host,
    port: Number(process.env.db_port),
    username: process.env.db_username,
    password: process.env.db_password,
    database: process.env.db_name,

    entities: [__dirname + '/**/*.entity.{ts,js}'],
    migrations: [__dirname + '/migrations/*.{ts,js}'],

    synchronize: false,
});
