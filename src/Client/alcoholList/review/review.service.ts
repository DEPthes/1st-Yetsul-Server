import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from '../../../Entity/s3.entity';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { CreateReviewDto } from '../../../DTO/review.dto';
import { Review } from '../../../Entity/Alcohol/review.entity';
import { ReviewRepository } from '../../../Repository/review.repository';
import { S3Repository } from '../../../Repository/s3.repository';
import { UserRepository } from 'src/auth/user.repository';
import { find } from 'rxjs';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(ReviewRepository)
    @InjectRepository(UserRepository)
    @InjectRepository(AlcoholRepository)
    @InjectRepository(S3Repository)
    private reviewRepository: ReviewRepository,
    private userRepository: UserRepository,
    private alcoholRepository: AlcoholRepository,
    private s3Repository: S3Repository
  ) { }

  // 해당 술에 대한 리뷰 작성
  async createReview(createReviewDto: CreateReviewDto, user_id: number, alcohol_id: number, files: Express.Multer.File[], location: string): Promise<Review> {

    try {
      const uploadFiles = [];
      for (const element of files) {
        const file = new S3();
        file.originalName = element.originalname;
        uploadFiles.push(file);
      }

      await this.s3Repository.save(uploadFiles);
      const url = (location);

      const alcohol = await this.alcoholRepository.findOne(alcohol_id);
      const user = await this.userRepository.findOne(user_id);
      return this.reviewRepository.createReview(createReviewDto, user, alcohol, url);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllReview(alcohol_id: number) {
    const query = this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용
    query.where('review.alcoholId = :alcoholId', { alcoholId: alcohol_id });
    const reviews = await query.getMany(); // 전부 가져옴. getOne()은 하나

    // No entity column "alcoholId" was found.
    // const reviews = await this.reviewRepository.find({
    //   where: {
    //     alcoholId: alcohol_id
    //   }
    // });

    const str = JSON.stringify(reviews);
    const obj = JSON.parse(str);
    console.log(obj);

    for (const key in reviews) {

      let userId = reviews[key].userId;
      let profileImg = await this.getProfileImgById(userId);
      obj[key].profileImg = profileImg;
    }

    return obj;
  }

  async getProfileImgById(id): Promise<String> {
    const user = this.userRepository.findOne(id);
    const profileImg = (await user).profileImg;

    return profileImg;
  }

  async getUsersReview(user: number): Promise<Review[]> {

    const query = this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용

    query.where('review.userId = :userId', { userId: user });

    const reviews = await query.getMany(); // 전부 가져옴. getOne()은 하나

    const str = JSON.stringify(reviews);
    const obj = JSON.parse(str);
    console.log(obj);

    for (const key in reviews) {

      let userId = reviews[key].userId;
      let profileImg = await this.getProfileImgById(userId);
      obj[key].profileImg = profileImg;
    }

    return obj;
  }

  async count(id: number) {
    const count = await this.alcoholRepository.count({
      where: {
        id: id
      }
    });
  }

  // 해당 술에 대한 리뷰 조회 상세 페이지 (술 정보, 리뷰들, 전체 리뷰수, 평점 비율)
  async getAllReview2(alcohol_id: number) {

    const alcohol = await this.alcoholRepository.findOne({
      where: {
        id: alcohol_id
      }
    });

    const query = this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용
    query.where('review.alcoholId = :alcoholId', { alcoholId: alcohol_id });
    const reviews = await query.getMany(); // 전부 가져옴. getOne()은 하나

    const str = JSON.stringify(reviews);
    const reviewsWithUserInfo = JSON.parse(str);
    console.log(reviewsWithUserInfo);

    for (const key in reviews) {

      let userId = reviews[key].userId;
      let profileImg = await this.getProfileImgById(userId);
      reviewsWithUserInfo[key].profileImg = profileImg;
    }

    const totalReviewCount = reviews.length; // 해당 술에 달린 리뷰 수 카운트

    // 각 별점 갯수
    const starCountArray = [];
    let sum = 0;
    for (let i = 0; i < 5; i++) {
      starCountArray[i] = await query
        .where('review.alcoholId = :alcoholId', { alcoholId: alcohol_id })
        .andWhere('review.star = :star', { star: i + 1 })
        .getCount();

      sum += starCountArray[i];
    }

    // 별점 비율
    const starPercentArray = [];

    // 퍼센티지 구하기. 우선 합 구하고(sum), 개별/sum
    for (let i = 0; i < 5; i++) {
      starPercentArray[i] = starCountArray[i] / sum;
    }

    return { alcohol, totalReviewCount, starPercentArray, reviewsWithUserInfo };
  }
}