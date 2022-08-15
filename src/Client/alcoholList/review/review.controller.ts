import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFiles, Req, Res } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from '../../../DTO/review.dto';
import { Review } from '../../../Entity/Alcohol/review.entity';
import { Alcohol } from 'src/Entity/Alcohol/alcohol.entity';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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

@ApiTags("리뷰 페이지")
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Post('/user') // 해당 유저가 작성한 모든 리뷰 조회
  @ApiBody({schema: {properties: {userId: { type: "number" }}}})
  @ApiOperation({ summary: '유저가 작성한 리뷰 조회 API', description: '유저가 작성한 리뷰 조회' })
  @ApiCreatedResponse({ description: '유저 id body으로 받음' })
  getUsersReview(@Body('user') user: number): Promise<Review[]> {
    return this.reviewService.getUsersReview(user);
  }

  @Post('/:id') // 해당 술에 대한 리뷰 작성
  @ApiOperation({ summary: '해당 술에 대한 리뷰 작성 API', description: '해당 술에 대한 리뷰 작성. /review/1' })
  @ApiCreatedResponse({ description: '술 id param으로 받음, 사용자는 body로', type: Alcohol })
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
    let location;
    
    if (request.files[0] == undefined) {
      console.log("no image file.");
      location = null;
    }else{
      console.log('image file exist.');
      location = request.files[0];
    }
    
    const uploadedReview = await this.reviewService.createReview(createReviewDto, user, alcohol, files, location);
    response.send(uploadedReview);
  }

  // 해당 술에 대한 모든 리뷰 조회 (리뷰만)
  @Get('/:id')
  @ApiOperation({ summary: '해당 술에 대한 모든 리뷰 조회 API', description: '해당 술에 대한 모든 리뷰 조회 /review/1' })
  @ApiCreatedResponse({ description: '술 id param으로 받음', type: Alcohol })
  getAllReview(@Param('id') alcohol_id: number): Promise<Review[]> {
    return this.reviewService.getAllReview(alcohol_id);
  }

  // 해당 술에 대한 리뷰 조회 상세 페이지 (술 정보, 리뷰들, 전체 리뷰수, 평점 비율)
  @Get('/:id/spec')
  @ApiOperation({ summary: '해당 술에 대한 모든 리뷰 조회 API', description: '해당 술에 대한 모든 리뷰 조회 /review/1' })
  @ApiCreatedResponse({ description: '술 id param으로 받음', type: Alcohol })
  getAllReview2(@Param('id') alcohol_id: number) {
    return this.reviewService.getAllReview2(alcohol_id);
  }
}
