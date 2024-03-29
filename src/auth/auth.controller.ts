import { Body, Controller, Get, Patch, Req, UseGuards, UseInterceptors, UploadedFiles, Res, Post, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetUser } from './getUser.decorator';
import { User } from './entities/user.entity';

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
    root() {
        return 'main page';

    }

    // 카카오 액세스 토큰 받고 사용자 확인 후 jwt 토큰 반환.
    @Get('/createjwttoken/:accesstoken')
    async getJwtToken(@Param('accesstoken') accesstoken: string) {
        const email = await this.authService.getUserInfoWithTokenKakao(accesstoken);
        return await this.authService.createJwt(email); // jwt 토큰 (jwt.io에 넣어보면 payload 나옴)
    }

    // jwt 토큰으로 사용자 정보 가져오기
    // useGuard로 authorize
    // 이런식으로 찜하기, 리뷰 작성 등등 하면 됨.
    // @GetUser는 커스텀 데코레이터. 강의 코드 참고
    // https://jwt.io/
    @UseGuards(AuthGuard())
    @Get('/getuserinfobyjwttokenkakao')
    async getuser(@GetUser() user: User) {
        console.log('user is', user);
        console.log('authorized');
        console.log('user id is ', user.id);
        return user;
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

    // 카카오 로그인
    @Get('/kakao')
    @ApiOperation({ summary: '카카오 로그인', description: '카카오 로그인' })
    @ApiCreatedResponse({ description: '카카오 로그인' })
    @UseGuards(AuthGuard('kakao')) // AuthGuard에 kakao 전달하면 Strategy 작성 시 작성한 명칭 찾아서 적용한다
    async kakaoAuth(@Req() req) {
    }

    // 카카오 로그인 후 콜백 url로 오는 요청 처리하는 api
    @Get('kakao/callback')
    @UseGuards(AuthGuard('kakao'))
    async kakaoAuthRedirect(@Req() req, @Res() res) { // req.user로 유저 프로필 값 가져옴
        console.log('토큰: ', req.user.accessToken); // 토큰을 갖고 리다이렉션 하면 됨.
        
        this.authService.kakaoLogin(req);
        
        // res.send(req.user.accessToken); // 중간 콜백 화면에 보여지고 리다이렉트 안됨.
        // res.write(req.user.accessToken);

        res.cookie('accessToken', req.user.accessToken, {httpOnly: true, secure: true, sameSite: 'None'}); // key, value, option
        // res.redirect(302, 'https://depth-server.herokuapp.com'+'/' + req.user.accessToken); //  // 이렇게 안하고 @Redirect 하면 쿠키가 리다이렉션 한 주소에 안담기는 듯 ?
        // res.redirect(200, '/'); // 200-> OK. Redirecting to /. 302은 바로
        //res.redirect('/kakaologin'); // 바로 리다이렉트

        res.redirect(302, 'http://localhost:3000/kakaologin');

        console.log('req.url: ', await req.url);
    }


    // 파라미터로 로그인해서 나온 액세스 토큰 넣어서 사용자 정보 확인하기. 카카오
    @Get('/kaka/:token')
    kaka(@Param('token') token: string, @Res() res) { // 커스텀 데코레이터
        // res.send('res.send("여기에 send 할 것 넣기??")');
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
        this.authService.kakaoLogout(token);
        res.redirect('/');

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

    // // 프로필 수정 (이메일)
    // @Patch('/edituser')
    // @UseInterceptors(FilesInterceptor("file", 10, {
    //     storage: multerS3({
    //         s3: s3,
    //         bucket: process.env.AWS_S3_BUCKET_NAME,
    //         contentType: multerS3.AUTO_CONTENT_TYPE,
    //         accessKeyId: process.env.AWS_ACCESS_KEY,
    //         acl: 'public-read',
    //         key: function (req, file, cb) {
    //             cb(null, `${Date.now().toString()}-${file.originalname}`);
    //         }
    //     }),
    // }))
    // editUser(@Body('email') email: string, @Body('nickname') nickname: string, @UploadedFiles() files: Express.Multer.File[], @Req() request) {
    //     // const location = request.files[0];

    //     let location;
    //     if (request.files[0] == undefined) {
    //         console.log("no image file.");
    //         location = null;
    //     }
    //     else {
    //         console.log('image file exist.');
    //         location = request.files[0];
    //     }

    //     return this.authService.editUser(email, nickname, files, location);
    // }

    // 프로필 수정 (토큰으로)
    @UseGuards(AuthGuard())
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
    editUser(@GetUser() user: User, @Body('nickname') nickname: string, @UploadedFiles() files: Express.Multer.File[], @Req() request) {
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

        const userId = user.id;

        return this.authService.editUser(userId, nickname, files, location);
    }

    // // 내가 찜한 술 목록
    // @Post('/myLikeAlcoholList')
    // myLikeAlcoholList(@Body('id') id: number) {
    //     return this.authService.myLikeAlcoholList(id);
    // }

    // 내가 찜한 술 목록 (토큰으로)
    @UseGuards(AuthGuard())
    @Post('/myLikeAlcoholList')
    myLikeAlcoholList(@GetUser() user: User) {

        const userId = user.id;

        return this.authService.myLikeAlcoholList(userId);
    }

    @UseGuards(AuthGuard())
    @Get('/user')
    getUser(@GetUser() user: User) {

        const userId = user.id;

        return this.authService.getUsersInfo(userId);
    }

}