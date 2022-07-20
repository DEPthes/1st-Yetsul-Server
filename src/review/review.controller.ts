import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFiles, Req, Res } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/review.dto';
import { Review } from './entities/review.entity';
import { Alcohol } from 'src/admin/alcohol/entities/alcohol.entity';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import 'dotenv/config';
import { FilesInterceptor } from '@nestjs/platform-express';

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
  region: process.env.AWS_REGION
});

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Post('/:id') // 해당 술에 대한 리뷰 작성
  @ApiOperation({ summary: '해당 술에 대한 리뷰 작성 API', description: '답과 그에 대응하는 선택지 조회. /review/1' })
  @ApiCreatedResponse({ description: '술 id param으로 받음', type: Alcohol })
  @UseInterceptors(FilesInterceptor("file", 10, {
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      acl: 'public-read',
      key: function (req, file, cb) {
        cb(null, `${Date.now().toString()}-${file.originalname}`);
      }
    }),
  }))
  async createReview(@Body() createReviewDto: CreateReviewDto, @Body('user') user: number, @Param() alcohol: number, @UploadedFiles() files: Express.Multer.File[], @Req() request, @Res() response) {
    const { location } = request.files[0];
    const uploadedReview = await this.reviewService.createReview(createReviewDto, user, alcohol, files, location);
    //return this.reviewService.createReview(createReviewDto, alcohol);
    response.send(uploadedReview);
  }

  @Get('/:id') // 해당 술에 대한 모든 리뷰 조회
  @ApiOperation({ summary: '해당 술에 대한 모든 리뷰 조회 API', description: '해당 술에 대한 모든 리뷰 조회 /review/1' })
  @ApiCreatedResponse({ description: '술 id param으로 받음', type: Alcohol })
  getAllReview(@Param('id') alcohol_id: number): Promise<Review[]> {
    return this.reviewService.getAllReview(alcohol_id);
  }

  @Get('user') // 해당 유저가 작성한 모든 리뷰 조회
  @ApiOperation({ summary: '유저가 작성한 리뷰 조회 API', description: '유저가 작성한 리뷰 조회' })
  @ApiCreatedResponse({ description: '유저 id body으로 받음' })
  getUsersReview(@Body('user') user: number): Promise<Review[]> {
    return this.reviewService.getUsersReview(user);
  }
}
