import { EntityRepository, Repository } from "typeorm";
import { Alcohol } from "../Entity/alcohol.entity";
import { AlcoholDto } from "../DTO/alcohol.dto";

@EntityRepository(Alcohol)
export class AlcoholRepository extends Repository<Alcohol> {

}