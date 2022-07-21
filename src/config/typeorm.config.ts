import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import 'dotenv/config';

export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST, // 'depth-db.cz96nnlicngq.ap-northeast-2.rds.amazonaws.com',
    port: 5432,
    username: process.env.DB_USERNAME, // 'postgres',
    password: process.env.DB_PASSWORD, // 'depth2022',
    database:  process.env.DB_DATABASE, // 'postgres',
    entities: [__dirname + '/../**/*.entity.{js, ts}'], // entities: [__dirname + '/../**/*.entity.{js, ts}', __dirname + '/../**/*.repository.{js, ts}'],
    synchronize: false,
}
