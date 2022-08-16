import { EntityRepository, Repository } from "typeorm";
import { Alcohol } from "../Entity/Alcohol/alcohol.entity";
import { AlcoholDto } from "../DTO/alcohol.dto";

@EntityRepository(Alcohol)
export class AlcoholRepository extends Repository<Alcohol> {
     // 개별 작품 조회시 마다 조회수 1 증가
     async likeCount(alcoholId: number) {
        const alcoholToUpdate = await this.findOne(alcoholId);
        alcoholToUpdate.likeCount += 1;

        await this.save(alcoholToUpdate);

        return alcoholToUpdate;
    }
}