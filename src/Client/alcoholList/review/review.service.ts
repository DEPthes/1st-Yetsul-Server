import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from '../../../Entity/s3.entity';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { CreateReviewDto } from '../../../DTO/review.dto';
import { Review } from '../../../Entity/Alcohol/review.entity';
import { ReviewRepository } from '../../../Repository/review.repository';
import { S3Repository } from '../../../Repository/s3.repository';
import { UserRepository } from 'src/auth/user.repository';
import { ReviewLikeRepository } from 'src/Repository/reviewLike.repository';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(ReviewRepository)
    @InjectRepository(UserRepository)
    @InjectRepository(AlcoholRepository)
    @InjectRepository(S3Repository)
    @InjectRepository(ReviewLikeRepository)
    private reviewRepository: ReviewRepository,
    private userRepository: UserRepository,
    private alcoholRepository: AlcoholRepository,
    private s3Repository: S3Repository,
    private reviewLikeRepository: ReviewLikeRepository
  ) { }

  // 해당 술에 대한 리뷰 작성
  async createReview(createReviewDto: CreateReviewDto, user_id: number, alcohol_id: number, files: Express.Multer.File[], location: string) {

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

      // const starSum = (await this.alcoholRepository.findOne(alcohol_id)).star + createReviewDto.star;

      const originalStar = (await this.alcoholRepository.findOne(alcohol_id)).star + '';
      console.log('originalStar is ', parseFloat(originalStar));
      const reviewStar = createReviewDto.star + '';
      console.log('reviewStar is ', parseFloat(reviewStar));



      await this.reviewRepository.createReview(createReviewDto, user, alcohol, url);

      const query = await this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용
      query.where('review.alcoholId = :alcoholId', { alcoholId: alcohol_id });
      const reviews = await query.getMany();

      const totalReviewCount = reviews.length; // 해당 술에 달린 리뷰 수 카운트
      const starSum = parseFloat(originalStar) * (totalReviewCount - 1) + parseFloat(reviewStar);
      console.log('totalReviewCount is ', totalReviewCount);
      console.log('starSum is ', starSum);
      const avgStar = starSum / totalReviewCount;
      console.log('avgStar is ', avgStar);
      console.log('====');

      alcohol.star = avgStar;
      await this.alcoholRepository.save(alcohol);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // 해당 술에 대한 모든 리뷰 조회 (리뷰만)
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
    // console.log(obj);

    for (const key in reviews) {

      let userId = reviews[key].userId;
      let profileImg = await this.getProfileImgById(userId);
      let nickname = await this.getNicknameById(userId);
      obj[key].profileImg = profileImg;
      obj[key].nickname = nickname;
    }

    return obj;
  }

  async getProfileImgById(id): Promise<String> {
    const user = this.userRepository.findOne(id);
    const profileImg = (await user).profileImg;

    return profileImg;
  }

  async getNicknameById(id): Promise<String> {
    const user = this.userRepository.findOne(id);
    const nickname = (await user).nickname;

    return nickname;
  }

  async getUsersReview(user: number): Promise<Review[]> {

    const query = this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용

    query.where('review.userId = :userId', { userId: user });

    const reviews = await query.getMany(); // 전부 가져옴. getOne()은 하나

    const str = JSON.stringify(reviews);
    const obj = JSON.parse(str);

    for (const key in reviews) {

      let userId = reviews[key].userId;
      let profileImg = await this.getProfileImgById(userId);
      let nickname = await this.getNicknameById(userId);
      obj[key].profileImg = profileImg;
      obj[key].nickname = nickname;
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
    // console.log(reviewsWithUserInfo);

    for (const key in reviews) {

      let userId = reviews[key].userId;
      let profileImg = await this.getProfileImgById(userId);
      let nickname = await this.getNicknameById(userId);
      reviewsWithUserInfo[key].profileImg = profileImg;
      reviewsWithUserInfo[key].nickname = nickname;
    }

    const totalReviewCount = reviews.length; // 해당 술에 달린 리뷰 수 카운트

    // 각 별점 갯수
    const starCountArray = [];
    let starPointSum = 0;
    for (let i = 0; i < 5; i++) {
      starCountArray[i] = await query
        .where('review.alcoholId = :alcoholId', { alcoholId: alcohol_id })
        .andWhere('review.star = :star', { star: i + 1 })
        .getCount();

      starPointSum += (starCountArray[i] * (i + 1));
    }

    // 별점 비율
    const starPercentArray = [];

    // 퍼센티지 구하기. 우선 합 구하고(sum), 개별/sum
    for (let i = 0; i < 5; i++) {
      starPercentArray[i] = starCountArray[i] / totalReviewCount;
    }

    return { alcohol, totalReviewCount, starPercentArray, reviewsWithUserInfo };
  }

  // 리뷰 하나 상세 조회
  async getOneReview(alcoholId: number, reviewId: number) {
    // return this.reviewRepository.findOne(reviewId);
    const query = this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용
    query.where('review.id = :reviewId', { reviewId: reviewId });
    const review = await query.getOne();

    const str = JSON.stringify(review);
    const obj = JSON.parse(str);

    let userId = review.userId;
    let profileImg = await this.getProfileImgById(userId);
    let nickname = await this.getNicknameById(userId);
    obj.profileImg = profileImg;
    obj.nickname = nickname;

    return obj;
  }

  // 리뷰 좋아요
  async reviewLike(alcoholId: number, reviewId: number, userId: number) {
    this.reviewRepository.likeCount(reviewId);

    const user = await this.userRepository.findOne(userId);

    const review = await this.reviewRepository.findOne(reviewId);

    return this.reviewLikeRepository.saveReviewLike(user, review);
  }
}