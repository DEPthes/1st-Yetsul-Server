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
        const thisReview = await this.findOne({
            where: {
                userId: user.id,
                reviewId: review.id
            }
        })
        if (thisReview) { // 이미 추천 했다면 -> 한번 더 누르면 삭제 되도록.
            await this.delete({
                userId: user.id,
                reviewId: review.id
            })
            // return '리뷰 좋아요 취소';
            return -1;
        }

        return this.save(result);
    }
}