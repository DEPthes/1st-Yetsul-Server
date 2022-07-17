import { EntityRepository, Repository } from "typeorm";
import { S3 } from "./entities/s3.entity";

@EntityRepository(S3)
export class S3Repository extends Repository<S3> {}