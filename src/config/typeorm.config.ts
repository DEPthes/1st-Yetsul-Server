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
    synchronize: true,
}

// export const typeORMConfig : TypeOrmModuleOptions = {
//     type: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: 'postgres',
//     password: 'bluesun', // DepthLocalTest, 맨 처음 로그인 한 비밀번호랑 같아야 함.
//     database: 'postgres',
//     entities: [__dirname + '/../**/*.entity.{js, ts}'], // entities: [__dirname + '/../**/*.entity.{js, ts}', __dirname + '/../**/*.repository.{js, ts}'],
//     synchronize: true,
// }