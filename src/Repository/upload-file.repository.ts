import { UploadFile } from "src/Entity/Alcohol/upload-file.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(UploadFile)
export class UploadFileRepository extends Repository<UploadFile> {}