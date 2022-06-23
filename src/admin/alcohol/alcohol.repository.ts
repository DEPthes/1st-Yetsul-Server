import { EntityRepository, Repository } from "typeorm";
import { Alcohol } from "./entities/alcohol.entity";
import { AlcoholDto } from "./dto/alcohol.dto";

@EntityRepository(Alcohol)
export class AlcoholRepository extends Repository<Alcohol> {

}