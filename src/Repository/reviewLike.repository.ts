import { EntityRepository, Repository } from "typeorm";
import { ReviewLike } from "src/Entity/Alcohol/reviewLike.entity";
import { User } from "src/auth/entities/user.entity";
import { Review } from "src/Entity/Alcohol/review.entity";

@EntityRepository(ReviewLike)
export class ReviewLikeRepository extends Repository<ReviewLike> {

    async saveReviewLike(user: User, review: Review) {

        const LikeReview = {user: user, review: review};
        const result = this.create(LikeReview);
        console.log('user.id is', user.id);
        console.log('review.id is', review.id);
        // console.log('find: ', await this.findOne({
        //     where: {
        //         userId: user.id,
        //         reviewId: review.id
        //     }
        // }));
        if (await this.findOne({
            where: {
                userId: user.id,
                reviewId: review.id
            }
        })) {
            return '이미 추천한 리뷰입니다.';
        }

        return this.save(result);
    }
}