import { EntityRepository, Repository } from "typeorm";
import { S3 } from "../Entity/s3.entity";

@EntityRepository(S3)
export class S3Repository extends Repository<S3> {}