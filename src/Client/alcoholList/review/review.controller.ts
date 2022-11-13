import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFiles, Req, Res, Query, Delete, Patch, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from '../../../DTO/review.dto';
import { Review } from '../../../Entity/Alcohol/review.entity';
import { Alcohol } from 'src/Entity/Alcohol/alcohol.entity';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import 'dotenv/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/entities/user.entity';


const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
  region: process.env.AWS_REGION
});

/*
1. 해당 유저 모든 리뷰 조회
2. 해당 유저 임시 저장 리뷰 조회
3. 리뷰 작성
4. 리뷰 임시 저장
5. 리뷰 수정
6. 리뷰 수정 - 이미지 삭제
7. 해당 술에 대한 모든 리뷰 조회 (리뷰만)
8. 해당 술에 대한 리뷰 조회 상세 페이지 (술 정보, 리뷰들, 전체 리뷰수, 평점 비율) spec
9. 리뷰 하나 상세 조회 url
10. 임시 저장 리뷰 하나 눌렀을 때
11. 리뷰 하나 삭제
12. 리뷰 좋아요
*/

@ApiTags("리뷰 페이지")
@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService
  ) { }

  // // 1. 해당 유저가 작성한 모든 리뷰 조회
  // // 지금은 SAVED, TEMPORARY 둘 다 나오는데 이걸 SAVED만 나오게 수정.
  // @Post('/user')
  // @ApiBody({ schema: { properties: { userId: { type: "number" } } } })
  // @ApiOperation({ summary: '유저가 작성한 리뷰 조회 API', description: '유저가 작성한 리뷰 조회' })
  // @ApiCreatedResponse({ description: '유저 id body으로 받음' })
  // getUsersReview(@Body('user') user: number): Promise<Review[]> {
  //   return this.reviewService.getUsersReview(user);
  // }

  // 1-2. 해당 유저가 작성한 모든 리뷰 조회 (토큰으로)
  // 지금은 SAVED, TEMPORARY 둘 다 나오는데 이걸 SAVED만 나오게 수정.
  @UseGuards(AuthGuard())
  @Post('/user')
  @ApiBody({ schema: { properties: { userId: { type: "number" } } } })
  @ApiOperation({ summary: '유저가 작성한 리뷰 조회 API', description: '유저가 작성한 리뷰 조회' })
  @ApiCreatedResponse({ description: '유저 id body으로 받음' })
  getUsersReview(@GetUser() user: User): Promise<Review[]> {

    const userId = user.id;

    return this.reviewService.getUsersReview(userId);
  }

  // // 2. 해당 유저가 임시 저장한 리뷰 조회
  // // 사용자의 전체 리뷰에서 TEMPORARY 리뷰만 나오게 하면 됨.
  // @Post('/user/temporary')
  // @ApiBody({ schema: { properties: { userId: { type: "number" } } } })
  // @ApiOperation({ summary: '유저가 임시 저장한 리뷰 조회 API', description: '유저가 임시 저장한 리뷰 조회' })
  // @ApiCreatedResponse({ description: '유저 id body으로 받음' })
  // getUsersTemporaryReview(@Body('user') user: number): Promise<Review[]> {
  //   return this.reviewService.getUsersTemporaryReview(user);
  // }

  // 2-2. 해당 유저가 임시 저장한 리뷰 조회 (토큰으로)
  // 사용자의 전체 리뷰에서 TEMPORARY 리뷰만 나오게 하면 됨.
  @UseGuards(AuthGuard())
  @Post('/user/temporary')
  @ApiBody({ schema: { properties: { userId: { type: "number" } } } })
  @ApiOperation({ summary: '유저가 임시 저장한 리뷰 조회 API', description: '유저가 임시 저장한 리뷰 조회' })
  @ApiCreatedResponse({ description: '유저 id body으로 받음' })
  getUsersTemporaryReview(@GetUser() user: User): Promise<Review[]> {

    const userId = user.id;

    return this.reviewService.getUsersTemporaryReview(userId);
  }

  // // 3. 해당 술에 대한 리뷰 작성 (이미지 파일 두개 이상 등록 가능)
  // @Post('/:id')
  // @ApiOperation({ summary: '해당 술에 대한 리뷰 작성 API', description: '해당 술에 대한 리뷰 작성. /review/1' })
  // @ApiCreatedResponse({ description: '술 id param으로 받음, 사용자는 body로', type: Alcohol })
  // @UseInterceptors(FilesInterceptor("file", 10, {
  //   storage: multerS3({
  //     s3: s3,
  //     bucket: process.env.AWS_S3_BUCKET_NAME,
  //     contentType: multerS3.AUTO_CONTENT_TYPE,
  //     accessKeyId: process.env.AWS_ACCESS_KEY,
  //     acl: 'public-read',
  //     key: function (req, file, cb) {
  //       cb(null, `${Date.now().toString()}-${file.originalname}`);
  //     }
  //   }),
  //   limits: {} // 이게 아마 제한 거는 거인듯, 예제에선 10장
  // }))
  // async createReview(@Body() createReviewDto: CreateReviewDto, @Body('user') user: number, @Param('id') alcohol: number, @UploadedFiles() files: Express.Multer.File[], @Req() request, @Res() response) {
  //   let location;

  //   if (request.files == undefined) {
  //     console.log("no image file.");
  //     location = null;
  //   }else{
  //     console.log('image file exist.');
  //     location = request.files;
  //   }

  //   const uploadedReview = await this.reviewService.createReview(createReviewDto, user, alcohol, files, location);

  //   response.send(uploadedReview);
  //   return uploadedReview;

  // }

  // 3-2. 해당 술에 대한 리뷰 작성 (프런트에서 userId 넣는 대신 jwt 토큰 넣으면, 백에서 userId 토큰에서 뽑아서 넣으면 됨 ?)
  @UseGuards(AuthGuard())
  @Post('/:id')
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
    limits: {} // 이게 아마 제한 거는 거인듯, 예제에선 10장
  }))
  async createReview2(@Body() createReviewDto: CreateReviewDto, @GetUser() user: User, @Param('id') alcohol: number, @UploadedFiles() files: Express.Multer.File[], @Req() request, @Res() response) {
    let location;

    if (request.files == undefined) {
      console.log("no image file.");
      location = null;
    } else {
      console.log('image file exist.');
      location = request.files;
    }

    // const userId = 1; // 원래는 userId(숫자) 넣어야 함.
    const userId = user.id;

    const uploadedReview = await this.reviewService.createReview(createReviewDto, userId, alcohol, files, location);

    response.send(uploadedReview);
    return uploadedReview;

  }

  // /* 
  // 4. 리뷰 임시 저장 ????
  // -> 리뷰 수정처럼.
  // 임시 저장 디비를 만들어야 하나
  // 게시물 자체의 플래그를 만들어도 됨 -> 상태값
  // -> 리뷰 dto에 상태 플래그 만들어야 함. 저장/임시저장 (save/temporary)
  // -> 임시 저장 플래그 달고있는 리뷰 아이디 파라미터로 받고 그 리뷰를 수정하자.
  // -> post로 할 지 아니면 patch로 할 지는 생각해보기.

  // 리뷰 작성할 때처럼 form으로 제목, 내용, 사진 받아야 함.
  // ㄴ 이것도 post랑 똑같이 해야하나.. 

  // -> 그냥 리뷰 작성이랑 똑같이 하고 status만 temporary로 설정해주면 됨.
  // -> 근데 이거 둘 코드 한줄 빼고는 똑같아서 합칠 수 있을거 같은데
  //  */
  // @Post('/:reviewId/temporary')
  // @ApiOperation({summary: '리뷰 임시저장 기능, 임시저장으로 저장한 리뷰는 temporary 플래그 달고 있어야 함.'})
  // @ApiCreatedResponse({ description: '술 id param으로 받음, 사용자는 body로', type: Alcohol })
  // @UseInterceptors(FilesInterceptor("file", 10, {
  //   storage: multerS3({
  //     s3: s3,
  //     bucket: process.env.AWS_S3_BUCKET_NAME,
  //     contentType: multerS3.AUTO_CONTENT_TYPE,
  //     accessKeyId: process.env.AWS_ACCESS_KEY,
  //     acl: 'public-read',
  //     key: function (req, file, cb) {
  //       cb(null, `${Date.now().toString()}-${file.originalname}`);
  //     }
  //   }),
  //   limits: {} // 이게 아마 제한 거는 거인듯, 예제에선 10장
  // }))
  // async postTemporaryReview(@Body() createReviewDto: CreateReviewDto, @Body('user') user: number, @Param('id') alcohol: number, @UploadedFiles() files: Express.Multer.File[], @Req() request, @Res() response) {
  //   let location;

  //   if (request.files == undefined) {
  //     console.log("no image file.");
  //     location = null;
  //   }else{
  //     console.log('image file exist.');
  //     location = request.files;
  //   }

  //   const uploadedReview = await this.reviewService.postTemporaryReview(createReviewDto, user, alcohol, files, location);

  //   response.send(uploadedReview);
  //   return uploadedReview;
  // }


  // 4-2. 리뷰 임시 저장 (토큰으로)
  @UseGuards(AuthGuard())
  @Post('/:id/temporary')
  @ApiOperation({ summary: '리뷰 임시저장 기능, 임시저장으로 저장한 리뷰는 temporary 플래그 달고 있어야 함.' })
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
    limits: {} // 이게 아마 제한 거는 거인듯, 예제에선 10장
  }))
  async postTemporaryReview2(@Body() createReviewDto: CreateReviewDto, @GetUser() user: User, @Param('id') alcohol: number, @UploadedFiles() files: Express.Multer.File[], @Req() request, @Res() response) {
    let location;

    if (request.files == undefined) {
      console.log("no image file.");
      location = null;
    } else {
      console.log('image file exist.');
      location = request.files;
    }

    const userId = user.id;

    const uploadedReview = await this.reviewService.postTemporaryReview(createReviewDto, userId, alcohol, files, location);

    response.send(uploadedReview);
    return uploadedReview;
  }

  // 5. 리뷰 수정
  // 우선 사진은 빼고
  // 수정할 수 있는 값: 제목, 내용, 별점, (사진)
  // 별점 수정하면 alcohol 엔티티 star 값 변경미치는거 해야 함.
  // ㄴ 완료(0901). 사진 추가만 하면 됨.
  // 1. 새로 사진 업로드 - 이건 그냥 포스트랑 똑같이 하면 됨
  // location, url 지운거 다시 추가하면 됨.
  // ㄴ 지금 사진 추가 안됨.. 왜?
  // 리턴값이 변경된 값이 아니고, 이전 내용들이 나옴.
  // 사진 추가 완료, 리턴값 변경된 값으로 나옴.
  @Post('/:id/update/:reviewId')
  @ApiOperation({ summary: '리뷰 수정', description: '리뷰 수정' })
  @ApiCreatedResponse({ description: '리뷰 수정' })
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
  async update(@Param('reviewId') reviewId: number, @Body() createReviewDto: CreateReviewDto, @UploadedFiles() files: Express.Multer.File[], @Req() request, @Res() response) {
    let location;

    if (request.files.length == 0) {
      console.log("파일 새로 추가 안함.");
      location = null;
    } else {
      console.log('image file exist.');
      location = request.files;
    }

    const updatedReview = await this.reviewService.updateReview(reviewId, createReviewDto, files, location);

    response.send(updatedReview);
    return updatedReview;
  }

  // 6. 리뷰 수정 - 이미지 삭제
  // 리뷰 수정 - 원래 있던 사진 삭제 - 이건 어떻게 해야 함? 
  // ㄴ 리뷰 디비에 가서 업데이트. x버튼 누르면 어차피 사진 배열로 저장되어 있으니까
  // 인덱스 써서 그냥 지우면 됨.
  @Patch('/:id/update/:reviewId/deleteimg')
  @ApiOperation({ summary: '리뷰 수정 - 이미지 삭제 API', description: '리뷰 수정 - 이미지 삭제' })
  @ApiCreatedResponse({ description: '리뷰 수정 - 이미지 삭제' })
  updateDeleteImg(@Param('reviewId') reviewId: number, @Body('imgIdx') imgIdx: number) { // 리뷰 아이디와 이미지 인덱스 받음.
    return this.reviewService.updateDeleteImg(reviewId, imgIdx);
  }

  // 7. 해당 술에 대한 모든 리뷰 조회 (리뷰만)
  @Get('/:id')
  @ApiOperation({ summary: '해당 술에 대한 모든 리뷰 조회 API', description: '해당 술에 대한 모든 리뷰 조회 /review/1' })
  @ApiCreatedResponse({ description: '술 id param으로 받음', type: Alcohol })
  getAllReview(@Param('id') alcohol_id: number): Promise<Review[]> {
    return this.reviewService.getAllReview(alcohol_id);
  }

  // 8. 해당 술에 대한 리뷰 조회 상세 페이지 (술 정보, 리뷰들, 전체 리뷰수, 평점 비율)
  @Get('/:id/spec')
  @ApiOperation({ summary: '해당 술에 대한 모든 리뷰 조회 API', description: '해당 술에 대한 모든 리뷰 조회 /review/1' })
  @ApiCreatedResponse({ description: '술 id param으로 받음', type: Alcohol })
  getAllReview2(@Param('id') alcohol_id: number) {
    return this.reviewService.getAllReview2(alcohol_id);
  }

  /*
  // 리뷰 하나 상세 조회
  @Get('/:alcoholId/:reviewId')
  @ApiOperation({ summary: '리뷰 하나 상세 조회 API', description: '리뷰 하나 상세 조회' })
  getOneReview(@Param('alcoholId') alcoholId: number, @Param('reviewId') reviewId: number) {
    return this.reviewService.getOneReview(alcoholId, reviewId);
  }
  */

  // 9. 리뷰 하나 상세 조회 url (/review?alcoholId=5&reviewId=1)
  @Get('')
  @ApiOperation({ summary: '리뷰 하나 상세 조회 API', description: '리뷰 하나 상세 조회' })
  getOneReview(@Query('alcoholId') alcoholId, @Query('reviewId') reviewId) {
    alcoholId = parseInt(alcoholId);
    reviewId = parseInt(reviewId);
    return this.reviewService.getOneReview(alcoholId, reviewId);
  }

  // 10. 임시 저장 리뷰 하나 누르면 수정하기 누른것처럼 하면 됨 -> 수정하기로 리다이렉트 ??
  // 지금은 여기서 바디에 데이터 넣어서 리다이렉트 하는데
  // 폼으로 바로 리다이렉트 해서 거기서 데이터 넣어야 함 (스프링에선 폼으로 리다이렉트함)
  @Post('/user/temporary/:reviewId')
  @ApiOperation({ summary: '임시 저장 리뷰 하나 누르면 API', description: '임시 저장 리뷰 하나 누르면' })
  @ApiCreatedResponse({ description: '임시 저장 리뷰 하나 누르면 수정하기로 리다이렉트?' })
  getOneTemporaryReview(@Param('reviewId') reviewId: number, @Res() res) {
    res.redirect(307, `/review/16/update/${reviewId}`);
  }

  // 11. 리뷰 하나 삭제
  // /review?alcoholId=5&reviewId=1
  @Delete('')
  @ApiOperation({ summary: '리뷰 하나 상세 조회 API', description: '리뷰 하나 상세 조회' })
  deelteOneReview(@Query('alcoholId') alcoholId, @Query('reviewId') reviewId) {
    alcoholId = parseInt(alcoholId);
    reviewId = parseInt(reviewId);
    return this.reviewService.deleteOneReview(alcoholId, reviewId);
  }

  // // 12. 리뷰 좋아요
  // @Post('')
  // @ApiOperation({ summary: '리뷰 좋아요 API', description: '리뷰 좋아요' })
  // reviewLike(@Query('alcoholId') alcoholId, @Query('reviewId') reviewId, @Body('userId') userId: number) {
  //   alcoholId = parseInt(alcoholId);
  //   reviewId = parseInt(reviewId);
  //   return this.reviewService.reviewLike(alcoholId, reviewId, userId);
  // }

  // 12-2. 리뷰 좋아요 (토큰으로)
  @UseGuards(AuthGuard())
  @Post('')
  @ApiOperation({ summary: '리뷰 좋아요 API', description: '리뷰 좋아요' })
  reviewLike2(@Query('alcoholId') alcoholId, @Query('reviewId') reviewId: string, @GetUser() user: User) {
    alcoholId = parseInt(alcoholId);
    const reviewId2 = parseInt(reviewId);

    const userId = user.id;

    return this.reviewService.reviewLike(alcoholId, reviewId2, userId);
  }
}