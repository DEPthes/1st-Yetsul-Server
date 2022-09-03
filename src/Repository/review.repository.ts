import { Alcohol } from "src/Entity/Alcohol/alcohol.entity";
import { User } from "src/auth/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateReviewDto } from "../DTO/review.dto";
import { Review, reviewStatus } from "../Entity/Alcohol/review.entity";

@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {
    // async createReview(createReviewDto: CreateReviewDto, user: User, alcohol: Alcohol, url: any): Promise<Review> {
    //     try {
    //         // const reviewImgUrl = url;
    //         let reviewImgUrl;
    //         if (url == null)
    //             reviewImgUrl = '';
    //         else {
    //             reviewImgUrl = url.location;
    //         }
    //         const {title, content, star} = createReviewDto;

    //         const review = this.create({ // 새로운 객체 생성. typeorm 메소드
    //             title,
    //             content,
    //             user,
    //             star,
    //             alcohol,
    //             reviewImgUrl,
    //             like: 0
    //         })

    //         return this.save(review); // db에 저장. typeorm 메소드
    //         // await this.save(review);
    //         // return review;
    //     } catch(error) {
    //         throw error;
    //     }
    // }

    // 리뷰 작성
    async createReview(createReviewDto: CreateReviewDto, user: User, alcohol: Alcohol, url, thisReviewStatus): Promise<Review> {
        try {

            let reviewImgUrl;
            if (url == null)
                reviewImgUrl = '';
            else {
                reviewImgUrl = url;
            }
            const { title, content, star } = createReviewDto;

            const review = this.create({ // 새로운 객체 생성. typeorm 메소드
                title,
                content,
                user,
                star,
                alcohol,
                reviewImgUrl,
                like: 0,
                reviewStatus: thisReviewStatus // 기본은 saved ?
            })

            return this.save(review); // db에 저장. typeorm 메소드
            // await this.save(review);
            // return review;
        } catch (error) {
            throw error;
        }
    }

    // 리뷰 수정
    async updateReview(reviewId: number, createReviewDto: CreateReviewDto, user: User, alcohol: Alcohol, url) {
        try {

            const originalReview = await this.findOne(reviewId); // 원래 리뷰
            let reviewImgUrl;
            if (url == null) {
                reviewImgUrl = [];
            }
            else {
                reviewImgUrl = url;
            }

            console.log('repository// url is ', url);
            console.log('repository// reviewImgUrl is ', reviewImgUrl);
            console.log('repository// originalReview.reviewImgUrl is ', originalReview.reviewImgUrl);
            

            const { title, content, star } = createReviewDto;

            this.update(reviewId, {
                title: title || originalReview.title, // 이렇게 하는거 아닌거 같은데..
                content: content || originalReview.content,
                star: star || originalReview.star,
                reviewImgUrl: originalReview.reviewImgUrl.concat(reviewImgUrl)
            })
        } catch (error) {
            throw error;
        }
    }

    // 리뷰 수정 중 이미지 삭제
    async updateDeleteImg(reviewId: number, imgIdx: number) {
        const review = await this.findOne(reviewId);
        let imgUrl = review.reviewImgUrl; // 이미지 url 배열
        imgUrl.splice(imgIdx, 1); // 특정 인덱스 원소 삭제
        review.reviewImgUrl = imgUrl;
        this.save(review);
        return imgUrl; // 남은 이미지 url
    }

    // 리뷰에 좋아요 누를때마다 좋아요 수 1 증가
    async likeCount(reviewId: number) {
        const reviewToUpdate = await this.findOne(reviewId);
        reviewToUpdate.like += 1;

        await this.save(reviewToUpdate);

        return reviewToUpdate;
    }
}