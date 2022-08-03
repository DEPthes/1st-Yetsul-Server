import { EntityRepository, Repository } from "typeorm";
import { Alcohol } from "../Entity/Alcohol/alcohol.entity";
import { AlcoholDto } from "../DTO/alcohol.dto";
import { Like } from "src/Entity/Alcohol/like.entity";
import { LikeDto } from "src/DTO/like.dto";
import { User } from "src/auth/entities/user.entity";

@EntityRepository(Like)
export class LikeRepository extends Repository<Like> {

    async saveUserLikedAlcohol(user: User, alcohol: Alcohol) {

        const LikeAlcohol = {userEmail: user, alcohol_id: alcohol};
        return this.save(LikeAlcohol);
    }
}