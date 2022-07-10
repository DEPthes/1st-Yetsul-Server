import { Alcohol } from "src/admin/alcohol/entities/alcohol.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateReviewDto } from "./dto/review.dto";
import { Review } from "./entities/review.entity";

@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {
    async createReview(createReviewDto: CreateReviewDto, alcohol: Alcohol): Promise<Review> {
        const {title, content, star} = createReviewDto;


        const review = this.create({ // 새로운 객체 생성. typeorm 메소드
            title,
            content,
            star,
            alcohol
        })

        await this.save(review); // db에 저장. typeorm 메소드
        return review;
    };
}