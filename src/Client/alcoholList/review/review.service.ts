import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from '../../../Entity/s3.entity';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { CreateReviewDto } from '../../../DTO/review.dto';
import { Review, reviewStatus } from '../../../Entity/Alcohol/review.entity';
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
  async createReview(createReviewDto: CreateReviewDto, user_id: number, alcohol_id: number, files: Express.Multer.File[], location) {

    try {
      const uploadFiles = [];
      const url = []; // 이미지 url을 배열로, 사진 여러장 담을 수 있도록
      for (const element in files) { // 파일 개수만큼 반복 돌리면서 url 넣기
        const file = new S3();
        file.originalName = files[element].originalname;
        file.url = location[element].location;
        url.push(file.url); // url 배열에 넣기
        uploadFiles.push(file); // S3 레포지토리에 저장 할 파일
      }

      await this.s3Repository.save(uploadFiles); // 파일 저장

      const alcohol = await this.alcoholRepository.findOne(alcohol_id); // 리뷰 작성 술
      const user = await this.userRepository.findOne(user_id); // 리뷰 작성자

      const originalStar = (await this.alcoholRepository.findOne(alcohol_id)).star + ''; // 리뷰 달기 전 술의 평균 별점
      console.log('originalStar is ', parseFloat(originalStar));
      const reviewStar = createReviewDto.star + ''; // 리뷰에 준 별점
      console.log('reviewStar is ', parseFloat(reviewStar));


      console.log('리뷰서비스: url: ', url);

      const thisReviewStatus = reviewStatus.SAVED;
      const result = await this.reviewRepository.createReview(createReviewDto, user, alcohol, url, thisReviewStatus); // 리뷰 레파지토리에 저장

      const query = await this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용
      query.where('review.alcoholId = :alcoholId', { alcoholId: alcohol_id });
      const reviews = await query.getMany(); // 해당 술에 달린 전체 리뷰 가져오기

      const totalReviewCount = reviews.length; // 해당 술에 달린 전체 리뷰 수 카운트
      const starSum = parseFloat(originalStar) * (totalReviewCount - 1) + parseFloat(reviewStar);
      console.log('totalReviewCount is ', totalReviewCount);
      console.log('starSum is ', starSum);
      const avgStar = starSum / totalReviewCount;
      console.log('avgStar is ', avgStar); // 해당 술의 최종 평균 별점
      console.log('====');

      alcohol.star = avgStar; // 술 별점 변경
      await this.alcoholRepository.save(alcohol);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // 임시 리뷰를 저장
  async postTemporaryReview(createReviewDto: CreateReviewDto, user_id: number, alcohol_id: number, files: Express.Multer.File[], location) {
    try {
      const uploadFiles = [];
      const url = []; // 이미지 url을 배열로, 사진 여러장 담을 수 있도록
      for (const element in files) { // 파일 개수만큼 반복 돌리면서 url 넣기
        const file = new S3();
        file.originalName = files[element].originalname;
        file.url = location[element].location;
        url.push(file.url); // url 배열에 넣기
        uploadFiles.push(file); // S3 레포지토리에 저장 할 파일
      }

      await this.s3Repository.save(uploadFiles); // 파일 저장

      const alcohol = await this.alcoholRepository.findOne(alcohol_id); // 리뷰 작성 술
      const user = await this.userRepository.findOne(user_id); // 리뷰 작성자


      const originalStar = (await this.alcoholRepository.findOne(alcohol_id)).star + ''; // 리뷰 달기 전 술의 평균 별점
      console.log('originalStar is ', parseFloat(originalStar));
      const reviewStar = createReviewDto.star + ''; // 리뷰에 준 별점
      console.log('reviewStar is ', parseFloat(reviewStar));


      console.log('리뷰서비스: url: ', url);

      const thisReviewStatus = reviewStatus.TEMPORARY; // 리뷰 status를 temp로 설정
      const result = await this.reviewRepository.createReview(createReviewDto, user, alcohol, url, thisReviewStatus); // 리뷰 레파지토리에 저장

      const query = await this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용
      query.where('review.alcoholId = :alcoholId', { alcoholId: alcohol_id });

      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // 리뷰 업데이트
  // 지금 업데이트는 되는데 술 star 계산해야 함.
  // ㄴ 완료, 사진만 하면 됨.
  async updateReview(reviewId: number, createReviewDto: CreateReviewDto, files: Express.Multer.File[], location) {
    try {

      const uploadFiles = []; // 새로 업로드한 파일들
      const url = []; // 이미지 url을 배열로, 사진 여러장 담을 수 있도록
      for (const element in files) { // 파일 개수만큼 반복 돌리면서 url 넣기
        const file = new S3();
        file.originalName = files[element].originalname;
        file.url = location[element].location;
        url.push(file.url); // url 배열에 넣기
        uploadFiles.push(file); // S3 레포지토리에 저장 할 파일
      }

      console.log('uploadFiles ', uploadFiles);
      console.log('url is ', url);

      await this.s3Repository.save(uploadFiles); // 새로 추가한 파일 저장

      const review = this.reviewRepository.findOne(reviewId);
      const alcohol = await this.alcoholRepository.findOne((await review).alcoholId); // 리뷰 작성 술
      const user = await this.userRepository.findOne((await review).userId); // 리뷰 작성자


      const originalStar = (alcohol.star + ''); // 리뷰 달기 전 술의 평균 별점
      console.log('originalStar is ', parseFloat(originalStar));
      const reviewStar = createReviewDto.star + ''; // 리뷰에 준 별점
      console.log('reviewStar is ', parseFloat(reviewStar));

      // 리뷰 수정
      // 여기다가 새로 업로드한 파일 추가해야 함. createReview 참고
      await this.reviewRepository.updateReview(reviewId, createReviewDto, user, alcohol, url);


      const query = await this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용
      query.where('review.alcoholId = :alcoholId', { alcoholId: (await review).alcoholId });
      const reviews = await query.getMany(); // 해당 술에 달린 전체 리뷰 가져오기

      const totalReviewCount = reviews.length; // 해당 술에 달린 전체 리뷰 수 카운트
      const starSum = parseFloat(originalStar) * (totalReviewCount) - (await review).star + parseFloat(reviewStar);
      console.log('totalReviewCount is ', totalReviewCount);
      console.log('starSum is ', starSum);
      const avgStar = starSum / totalReviewCount;
      console.log('avgStar is ', avgStar); // 해당 술의 최종 평균 별점
      console.log('====');

      alcohol.star = avgStar; // 술 별점 변경
      await this.alcoholRepository.save(alcohol);
      return await this.reviewRepository.findOne(reviewId);;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // 리뷰 수정 중 이미지 삭제
  async updateDeleteImg(reviewId: number, imgIdx: number) {
    return this.reviewRepository.updateDeleteImg(reviewId, imgIdx);
  }

  // 해당 술에 대한 모든 리뷰 조회 (리뷰만)
  async getAllReview(alcohol_id: number) {
    const query = this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용
    query
      .where('review.alcoholId = :alcoholId', { alcoholId: alcohol_id })
      .andWhere('review.reviewStatus = :reviewStatus', { reviewStatus: reviewStatus.SAVED })

    const reviews = await query.getMany(); // 전부 가져옴. getOne()은 하나

    // No entity column "alcoholId" was found.
    // const reviews = await this.reviewRepository.find({
    //   where: {
    //     alcoholId: alcohol_id
    //   }
    // });

    const str = JSON.stringify(reviews);
    let obj = JSON.parse(str);
    // console.log(obj);

    for (const key in reviews) {

      let userId = reviews[key].userId;
      let profileImg = await this.getProfileImgById(userId);
      let nickname = await this.getNicknameById(userId);
      obj[key].profileImg = profileImg;
      obj[key].nickname = nickname;
    }

    obj = obj.sort(function (a, b) {
      return a.id - b.id;
    })

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

  // 해당 유저 작성한 리뷰 조회
  // SAVED만 나오게.
  async getUsersReview(user: number): Promise<Review[]> {

    const query = this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용

    query.where('review.userId = :userId', { userId: user })
      .andWhere('review.reviewStatus = :reviewStatus', { reviewStatus: reviewStatus.SAVED });

    const reviews = await query.getMany(); // 전부 가져옴. getOne()은 하나

    const str = JSON.stringify(reviews);
    let obj = JSON.parse(str);

    for (const key in reviews) {

      let userId = reviews[key].userId;
      let profileImg = await this.getProfileImgById(userId);
      let nickname = await this.getNicknameById(userId);
      obj[key].profileImg = profileImg;
      obj[key].nickname = nickname;
    }

    obj = obj.sort(function (a, b) {
      return a.id - b.id;
    })

    return obj;
  }

  // 임시 저장된 리뷰 
  // TEMPORARY만 나오게.
  async getUsersTemporaryReview(user: number): Promise<Review[]> {

    const query = this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용

    query.where('review.userId = :userId', { userId: user })
      .andWhere('review.reviewStatus = :reviewStatus', { reviewStatus: reviewStatus.TEMPORARY });

    const reviews = await query.getMany(); // 전부 가져옴. getOne()은 하나

    const str = JSON.stringify(reviews);
    let obj = JSON.parse(str);

    for (const key in reviews) {

      let userId = reviews[key].userId;
      let profileImg = await this.getProfileImgById(userId);
      let nickname = await this.getNicknameById(userId);
      obj[key].profileImg = profileImg;
      obj[key].nickname = nickname;
    }

    obj = obj.sort(function (a, b) {
      return a.id - b.id;
    })

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
    query
      .where('review.alcoholId = :alcoholId', { alcoholId: alcohol_id })
      .andWhere('review.reviewStatus = :reviewStatus', { reviewStatus: reviewStatus.SAVED })
    const reviews = await query.getMany(); // 전부 가져옴. getOne()은 하나

    const str = JSON.stringify(reviews);
    let reviewsWithUserInfo = JSON.parse(str);
    // console.log(reviewsWithUserInfo);

    for (const key in reviews) {

      let userId = reviews[key].userId;
      let profileImg = await this.getProfileImgById(userId);
      let nickname = await this.getNicknameById(userId);
      reviewsWithUserInfo[key].profileImg = profileImg;
      reviewsWithUserInfo[key].nickname = nickname;
    }

    reviewsWithUserInfo = reviewsWithUserInfo.sort(function (a, b) {
      return a.id - b.id;
    })

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

    review.viewCount += 1;
    this.reviewRepository.save(review);

    const str = JSON.stringify(review);
    const obj = JSON.parse(str);

    let userId = review.userId;
    let profileImg = await this.getProfileImgById(userId);
    let nickname = await this.getNicknameById(userId);
    obj.profileImg = profileImg;
    obj.nickname = nickname;

    return obj;
  }

  // 리뷰 하나 삭제
  async deleteOneReview(alcoholId: number, reviewId: number) {
    return await this.reviewRepository.delete(reviewId);
  }

  // 리뷰 좋아요
  async reviewLike(alcoholId: number, reviewId: number, userId: number) {
    // this.reviewRepository.likeCount(reviewId); // 이걸 여기서 하는게 아니라

    const user = await this.userRepository.findOne(userId);

    // const review = await this.reviewRepository.findOne(reviewId);
    /////
    const query = this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용
    query.where('review.id = :reviewId', { reviewId: reviewId });
    const review = await query.getOne();

    // return this.reviewLikeRepository.saveReviewLike(user, review); // 여기서 성공시 1 증가시키는걸로 해야겠는데?
    const result = await this.reviewLikeRepository.saveReviewLike(user, review);
    if (result == -1) {// 여기서 성공시 1 증가시키는걸로 해야겠는데?
      this.reviewRepository.likeCount(reviewId, -1);
    } else {
      this.reviewRepository.likeCount(reviewId, 1);
    }
    return result;
  }

  // 사용자가 리뷰 좋아요 했는지 확인하기 (사용자 정보 아이디로 받음 - 토큰)
  async likeOrNot(userId: number, reviewId: number) {

    const user = await this.userRepository.findOne({ // 사용자
      where: {
        id: userId
      }
    });

    const existLike = await this.reviewLikeRepository.findOne({
      where: {
        reviewId: reviewId,
        userId: user.id
      }
    });

    if (existLike) {
      return 'LIKE';
    } else {
      return 'NOT';
    }
  }
}