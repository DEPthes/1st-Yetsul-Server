import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from './entities/s3.entity';
import { AlcoholRepository } from 'src/admin/alcohol/alcohol.repository';
import { CreateReviewDto } from './dto/review.dto';
import { Review } from './entities/review.entity';
import { ReviewRepository } from './review.repository';
import { S3Repository } from './s3.repository';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(ReviewRepository)
    @InjectRepository(AlcoholRepository)
    @InjectRepository(S3Repository)
    private reviewRepository: ReviewRepository,
    private alcoholRepository: AlcoholRepository,
    private s3Repository: S3Repository
  ) { }

  // 해당 술에 대한 리뷰 작성
  async createReview(createReviewDto: CreateReviewDto, alcohol_id: number, files: Express.Multer.File[], location: string): Promise<Review> {

    try {
      const uploadFiles = [];
      for (const element of files) {
        const file = new S3();
        file.originalName = element.originalname;
        uploadFiles.push(file);
      }

      await this.s3Repository.save(uploadFiles);
      const url = (location);
      console.log({ url });

      const alcohol = await this.alcoholRepository.findOne(alcohol_id);
      return this.reviewRepository.createReview(createReviewDto, alcohol, url);
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
}
