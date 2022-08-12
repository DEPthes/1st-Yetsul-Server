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

  async getAllReview(alcohol_id: number): Promise<Review[]> {
    const query = this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용
    query.where('review.alcoholId = :alcoholId', { alcoholId: alcohol_id });
    const reviews = await query.getMany(); // 전부 가져옴. getOne()은 하나
  
    return reviews;
  }

  async getUsersReview(user: number): Promise<Review[]> {

    const query = this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용

    query.where('review.userId = :userId', { userId: user });

    const reviews = await query.getMany(); // 전부 가져옴. getOne()은 하나

    return reviews;
  }

  // async calcualateStar(id)  {
  //   // id = 5;
  //   const arr = find(where: alid: 5); // 배열에 별점들ㅇ ㅣ다 저장됨
  //   const 합;
  //   const answer = 합 / arr.count() // 8/3
  //   return answer;
  // }
}
