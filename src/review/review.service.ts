import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlcoholRepository } from 'src/admin/alcohol/alcohol.repository';
import { Alcohol } from 'src/admin/alcohol/entities/alcohol.entity';
import { CreateReviewDto } from './dto/review.dto';
import { Review } from './entities/review.entity';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(ReviewRepository)
    @InjectRepository(AlcoholRepository)
    private reviewRepository: ReviewRepository,
    private alcoholRepository: AlcoholRepository
  ) { }

  async createReview(createReviewDto: CreateReviewDto, alcohol_id: number): Promise<Review> {
    const alcohol = await this.alcoholRepository.findOne(alcohol_id);
    return this.reviewRepository.createReview(createReviewDto, alcohol);
  }

  async getAllReview(alcohol_id: number): Promise<Review[]> {

        const query = this.reviewRepository.createQueryBuilder('review'); // 쿼리 사용

        query.where('review.alcoholId = :alcoholId', {alcoholId: alcohol_id});

        const reviews = await query.getMany(); // 전부 가져옴. getOne()은 하나

        return reviews;
  }
}
