import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, Redirect, UseInterceptors, UploadedFiles, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';
import { GetUser } from './getUser.decorator';

const s3 = new AWS.S3();
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS,
    region: process.env.AWS_REGION
});

@ApiTags("auth")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    
    @Get('/mypage')
    @UseGuards(AuthGuard('kakao'))
    async mypage(@GetUser() user: User){

        return ;
    }

    // // 찜하기
    // @UseGuards(AuthGuard('kakao'))
    // @Post('/like/:alcoholId')
    // likeAlcohol(@Body('userId') userId: number, @Param('alcoholId') alcoholId: number) {
    //     return this.authService.likeAlcohol(userId, alcoholId);
    // }

    // 구글 로그인 페이지로 리다이렉션 할 api
    @Get('/google')
    @ApiOperation({ summary: '구글 로그인', description: '구글 로그인' })
    @ApiCreatedResponse({ description: '구글 로그인' })
    @UseGuards(AuthGuard('google')) // AuthGuard에 google 전달하면 Strategy 작성 시 작성한 명칭 찾아서 적용한다
    async googleAuth(@Req() req) {

    }

    // 구글 로그인 후 콜백 url로 오는 요청 처리하는 api
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) { // req.user로 유저 프로필 값 가져옴
        return this.authService.googleLogin(req);
    }

    // 네이버 로그인
    @Get('/naver')
    @ApiOperation({ summary: '네이버 로그인', description: '네이버 로그인' })
    @ApiCreatedResponse({ description: '네이버 로그인' })
    @UseGuards(AuthGuard('naver')) // AuthGuard에 naver 전달하면 Strategy 작성 시 작성한 명칭 찾아서 적용한다
    async naverAuth(@Req() req) {

    }

    // 네이버 로그인 후 콜백 url로 오는 요청 처리하는 api
    @Get('naver/callback')
    @UseGuards(AuthGuard('naver'))
    naverAuthRedirect(@Req() req) { // req.user로 유저 프로필 값 가져옴
        return this.authService.naverLogin(req);
    }

    // 카카오 로그인
    @Get('/kakao')
    @ApiOperation({ summary: '카카오 로그인', description: '카카오 로그인' })
    @ApiCreatedResponse({ description: '카카오 로그인' })
    @UseGuards(AuthGuard('kakao')) // AuthGuard에 kakao 전달하면 Strategy 작성 시 작성한 명칭 찾아서 적용한다
    async kakaoAuth(@Req() req) {
        console.log("카카오 로그인 시작");

    }

    @Get('/hello')
    hello(@Req() req){
        console.log(req);
        return req
    }


    // 카카오 로그인 후 콜백 url로 오는 요청 처리하는 api
    // @Redirect('http://depth-itw.s3-website.ap-northeast-2.amazonaws.com/', 301)
    @Redirect('https://depth-server.herokuapp.com/auth/hello', 301)
    @Get('kakao/callback')
    // @Get('http://depth-itw.s3-website.ap-northeast-2.amazonaws.com/')
    @UseGuards(AuthGuard('kakao'))
    kakaoAuthRedirect(@Req() req) {// req.user로 유저 프로필 값 가져옴  Promise<{accessToken: string}>
        // console.log("카카오 로그인 종료");
        // console.log("리퀘스트가 무엇일까요?");
        // console.log(req);
        console.log("리퀘스트 유자어우어우어 무엇일까요?");
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', req.user.accessToken);
    
        const accessToken = this.authService.kakaoLogin(req)

        return accessToken ; // redirection 할 때는 accessToken으로 보내줘야함.
    }

    // 개발 / 관리자 사용 용도 : 등록된 유저 정보 가져오기
    @Get('/userinfo')
    getUsersInfo() {
        return this.authService.getUsersInfo();
    }

    @Patch('/edituser')
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
    editUser(@Body('id') id: number, @Body('nickname') nickname: string, @UploadedFiles() files: Express.Multer.File[], @Req() request) {
        // const location = request.files[0];

        let location;
        if (request.files[0] == undefined) {
            console.log("no image file.");
            location = null;
        }
        else {
            console.log('image file exist.');
            location = request.files[0];
        }

        return this.authService.editUser(id, nickname, files, location);
    }


    // @UseGuards(AuthGuard('jwt'))
    // @Get('profile')
    // getProfile(@Req() req) {
    //     return req.user;
    // }
}
