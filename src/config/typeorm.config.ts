import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import 'dotenv/config';

export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database:  process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity.{js, ts}'], // entities: [__dirname + '/../**/*.entity.{js, ts}', __dirname + '/../**/*.repository.{js, ts}'],
    synchronize: true,
}