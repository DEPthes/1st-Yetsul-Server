import { EntityRepository, Repository } from "typeorm";
import { Alcohol } from "../Entity/Alcohol/alcohol.entity";
import { Like } from "src/Entity/Alcohol/like.entity";
import { User } from "src/auth/entities/user.entity";

@EntityRepository(Like)
export class LikeRepository extends Repository<Like> {

    async saveUserLikedAlcohol(user: User, alcohol: Alcohol) {

        const LikeAlcohol = {user: user, alcohol: alcohol};
        const result = this.create(LikeAlcohol)
        return this.save(result);
    }
}