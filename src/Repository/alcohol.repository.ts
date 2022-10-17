import { EntityRepository, Repository } from "typeorm";
import { Alcohol } from "../Entity/Alcohol/alcohol.entity";

@EntityRepository(Alcohol)
export class AlcoholRepository extends Repository<Alcohol> {

    // 찜하기 마다 조회수 1 증가
     async likeCount(alcoholId: number) {
        const alcoholToUpdate = await this.findOne(alcoholId);
        alcoholToUpdate.likeCount += 1;

        await this.save(alcoholToUpdate);

        return alcoholToUpdate;
    }

    // 조회수 1 감소
    async likeCountMinus(alcoholId: number) {
        const alcoholToUpdate = await this.findOne(alcoholId);
        alcoholToUpdate.likeCount -= 1;

        await this.save(alcoholToUpdate);

        return alcoholToUpdate;
    }

    // 술 사진 저장
    async putAlcoholImage(alcohol_id: number, url) {
        console.log('url is ', url[0]);
        this.update(alcohol_id, {
            alcoholImage : url[0]
        })
    }
}