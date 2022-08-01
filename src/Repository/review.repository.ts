import { Alcohol } from "src/Entity/alcohol.entity";
import { User } from "src/auth/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateReviewDto } from "../DTO/review.dto";
import { Review } from "../Entity/review.entity";

@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {
    async createReview(createReviewDto: CreateReviewDto, user: User, alcohol: Alcohol, url: any): Promise<Review> {
        try {
            // const reviewImgUrl = url;
            let reviewImgUrl;
            if (url == null)
                reviewImgUrl = '';
            else {
                reviewImgUrl = url.location;
            }
            const {title, content, star} = createReviewDto;

            const review = this.create({ // 새로운 객체 생성. typeorm 메소드
                title,
                content,
                user,
                star,
                alcohol,
                reviewImgUrl
            })

            return this.save(review); // db에 저장. typeorm 메소드
            // await this.save(review);
            // return review;
        } catch(error) {
            throw error;
        }
    }
}