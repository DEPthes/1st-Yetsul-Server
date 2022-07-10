import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/review.dto';
import { Review } from './entities/review.entity';
import { Alcohol } from 'src/admin/alcohol/entities/alcohol.entity';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/:id') // 해당 술에 대한 리뷰 작성
  @ApiOperation({ summary: '해당 술에 대한 리뷰 작성 API', description: '답과 그에 대응하는 선택지 조회. /review/1'  })
    @ApiCreatedResponse({ description: '술 id param으로 받음', type: Alcohol })
  createReview(@Body() createReviewDto: CreateReviewDto, @Param() alcohol: number): Promise<Review> {
    return this.reviewService.createReview(createReviewDto, alcohol);
  }

  @Get('/:id') // 해당 술에 대한 모든 리뷰 조회
  @ApiOperation({ summary: '해당 술에 대한 모든 리뷰 조회 API', description: '해당 술에 대한 모든 리뷰 조회 /review/1' })
    @ApiCreatedResponse({ description: '술 id param으로 받음', type: Alcohol })
  getAllReview(@Param('id') alcohol_id: number): Promise<Review[]> {
    return this.reviewService.getAllReview(alcohol_id);
  }
}
