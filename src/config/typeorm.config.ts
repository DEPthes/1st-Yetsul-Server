import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'depth-db.cz96nnlicngq.ap-northeast-2.rds.amazonaws.com',
    port: 5432,
    username: 'postgres',
    password: 'depth2022',
    database: 'postgres',
    entities: [__dirname + '/../**/*.entity.{js, ts}'],
    synchronize: true,
}