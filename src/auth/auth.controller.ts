
import { Body, Controller, Get, Patch, Req, UseGuards, UseInterceptors, UploadedFiles, Res, Post, ValidationPipe, Param, Redirect, Query } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetUser } from './getUser.decorator';
import { User } from './entities/user.entity';

interface JwtPayload {
    sub;
    email: string;
}


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

    @Get()
    // @UseGuards(AuthGuard('kakao'))
    root() {
        return 'main page';

    }

    @Get('docs')
    @Redirect('https://docs.nestjs.com', 302)
    getDocs(@Query('version') version) {
        if (version && version === '5') {
            return { url: 'https://docs.nestjs.com/v5/' };
        }
    }

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
    googleAuthRedirect(@Req() req, @Res() res) { // req.user로 유저 프로필 값 가져옴
        console.log('구글 액세스 토큰: ', req.user.accessToken);
        res.redirect('/' + req.user.accessToken);
        return this.authService.googleLogin(req);
    }

    // 0811 ==========================================================

    /* 새로운 구글
    // jwt로 직접 액세스 토큰 만드는 방식.
    // 참고한 주소: https://velog.io/@sinf/Nest.js에서-Goolge-Oauth-적용하기

    // 구글 로그인 페이지로 리다이렉션 할 api
    @Get('/google')
    @ApiOperation({ summary: '구글 로그인', description: '구글 로그인' })
    @ApiCreatedResponse({ description: '구글 로그인' })
    @UseGuards(AuthGuard('google')) // AuthGuard에 google 전달하면 Strategy 작성 시 작성한 명칭 찾아서 적용한다
    async googleAuth() {

    }

    // 구글 로그인 후 콜백 url로 오는 요청 처리하는 api
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) { // req.user로 유저 프로필 값 가져옴
        const user = await this.authService.findByProviderIdOrSave(req.user);

        const payload: JwtPayload = { sub: user.id, email: user.email };

        const { accessToken, refreshToken } = this.authService.getToken(payload);

        res.cookie('access-token', accessToken); // @Res() res: Response 에서 Response 지우면 오류 안남.
        res.cookie('refresh-token', refreshToken);

        // await this.authService.updateHashedRefreshToken(user.id, refreshToken);
        console.log('accessToken is ', accessToken);

        res.redirect(process.env.DOMAIN); // http://localhost:3000/auth/test 이 주소로 리다이렉트 되면 network - headers - 헤더에 토큰 가져감? velog 참고
    }

    */

    // 강의랑 똑같은 테스트. 계속 401 unauthorized 뜸.
    @Get('/test')
    @UseGuards(AuthGuard('jwt')) // req안에 유저 객체 넣기 위해 추가해야 함.
    test(@GetUser() user: User) { // 커스텀 데코레이터
        console.log(user);
        return user;
    }

    // 파라미터로 로그인해서 나온 액세스 토큰 넣어서 사용자 정보 확인하기. 카카오
    @Get('/kaka/:token')
    kaka(@Param('token') token: string, @Res() res) { // 커스텀 데코레이터
        res.send('res.send("여기에 send 할 것 넣기??")');
        return this.authService.getUserInfoWithTokenKakao(token);
    }

    // 파라미터로 로그인해서 나온 액세스 토큰 넣어서 사용자 정보 확인하기. 구글
    @Get('/googl/:token')
    googl(@Param('token') token: string) { // 커스텀 데코레이터
        return this.authService.getUserInfoWithTokenGoogle(token);
    }

    // 파라미터로 로그인해서 나온 액세스 토큰 넣어서 사용자 정보 확인하기. 네이버
    @Get('/nave/:token')
    nave(@Param('token') token: string) { // 커스텀 데코레이터
        return this.authService.getUserInfoWithTokenNaver(token);
    }

    // 카카오 로그아웃
    @Get('/aa/:token')
    kakaoLogout(@Param('token') token: string, @Res() res) {
        // res.cookie('cookie', '', {maxAge: 0});
        return this.authService.kakaoLogout(token);
    }

    // 구글 로그아웃
    @Get('bb/:token')
    googleLogout(@Param('token') token: string) {
        return this.authService.googleLogout(token);
    }

    // 구글 로그아웃2
    @Get('cc/:token')
    googleLogout2(@Param('token') token: string, @Req() req, @Res() res) {
        req.logout();
    }



    // ==========================================================




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
    naverAuthRedirect(@Req() req, @Res() res) { // req.user로 유저 프로필 값 가져옴
        console.log('네이버 액세스 토큰: ', req.user.accessToken);
        // res.redirect('/' + req.user.accessToken);
        return this.authService.naverLogin(req);
    }

    // // 카카오 로그인 후 콜백 url로 오는 요청 처리하는 api
    // // @Redirect('http://depth-itw.s3-website.ap-northeast-2.amazonaws.com/', 301)
    // // @Redirect(`http://localhost:3000/auth/eeeee`, 301)
    // // @Get('http://depth-itw.s3-website.ap-northeast-2.amazonaws.com/')
    // @Get('kakao/callback')
    // @UseGuards(AuthGuard('kakao'))
    // kakaoAuthRedirect(@Req() req, @Res() res) {// req.user로 유저 프로필 값 가져옴  Promise<{accessToken: string}>
    //     console.log("리퀘스트 유자어우어우어 무엇일까요?");
    //     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', req.user.accessToken);

    //     // return accessToken ; // redirection 할 때는 accessToken으로 보내줘야함.
    //     return this.authService.kakaoLogin(req); // 토큰

    //     // res.redirect('http://localhost:3000/auth/kakao/rrrr');
    // }    

    // 카카오 로그인
    @Get('/kakao')
    @ApiOperation({ summary: '카카오 로그인', description: '카카오 로그인' })
    @ApiCreatedResponse({ description: '카카오 로그인' })
    @UseGuards(AuthGuard('kakao')) // AuthGuard에 kakao 전달하면 Strategy 작성 시 작성한 명칭 찾아서 적용한다
    async kakaoAuth(@Req() req) {

    }

    // 카카오 로그인 후 콜백 url로 오는 요청 처리하는 api
    @Get('kakao/callback')
    @Redirect('http://localhost:3000/')
    @UseGuards(AuthGuard('kakao'))
    kakaoAuthRedirect(@Req() req, @Res() res) { // req.user로 유저 프로필 값 가져옴
        console.log('토큰: ', req.user.accessToken); // 토큰을 갖고 리다이렉션 하면 됨.
        // console.log('res: ', res); // 여기에 accessToken 들어있긴 함..

        // 토큰을 param에 넣은 주소로 리다이렉트.
        // 이 주소를 프론트 주소로 바꾸면 됨.
        // res.redirect('/auth/');

        this.authService.kakaoLogin(req);
        // res.send(req.user.accessToken);
        res.cookie('accessToken', req.user.accessToken); // key, value, option
        // res.cookie(req.user.accessToken);
        // res.redirect('/auth/');
    }

    // 개발 / 관리자 사용 용도 : 등록된 유저 정보 가져오기
    @Get('/userinfo')
    getUsersInfo() {
        return this.authService.getUsersInfo();
    }

    // 프로필 수정
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
    editUser(@Body('email') email: string, @Body('nickname') nickname: string, @UploadedFiles() files: Express.Multer.File[], @Req() request) {
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

        return this.authService.editUser(email, nickname, files, location);
    }

    // 내가 찜한 술 목록
    @Post('/myLikeAlcoholList')
    myLikeAlcoholList(@Body('id') id: number) {
        return this.authService.myLikeAlcoholList(id);
    }

    // @Get('/test')
    // @UseGuards(AuthGuard('kakao')) // validate에서 리턴되는 값이 들어감. req안에 유저 객체 넣기 위해 추가해야 함.
    // test(@Req() req) { // 커스텀 데코레이터
    //     console.log("req : ", req);
    //     return "ok";
    // }
}
