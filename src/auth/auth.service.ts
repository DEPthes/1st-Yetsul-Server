import { BadRequestException, Injectable, UploadedFiles } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { S3 } from 'src/Entity/s3.entity';
import { S3Repository } from 'src/Repository/s3.repository';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from "@nestjs/axios";
import axios from 'axios';
import { LikeRepository } from 'src/Repository/like.repository';
import qs from 'qs';
import fetch from "node-fetch";

interface JwtPayload {
    sub;
    email: string;
}

@Injectable()
export class AuthService {
    private http: HttpService;
    constructor(
        @InjectRepository(UserRepository)
        @InjectRepository(S3Repository)
        @InjectRepository(LikeRepository)
        @InjectRepository(AlcoholRepository)
        private userRepository: UserRepository,
        private s3Repository: S3Repository,
        private likeRepository: LikeRepository,
        private alcoholRepository: AlcoholRepository,
        private jwtService: JwtService
    ) {
        this.http = new HttpService();
    }

    // jwt 토큰 생성
    async createJwt(email) {
        try {
            const payload = { email }; // 중요한 정보는 x
            const accessToken = await this.jwtService.sign(payload);
            console.log('accessToken is ', accessToken);
            return accessToken;
        } catch {
            console.log(console.error());
        };
    }

    // 0811 ==========================================================

    // findByProviderIdOrSave in UserService
    async findByProviderIdOrSave(googleUser) {
        const { providerId, provider, email, name } = googleUser;

        const user = await this.userRepository.findOne({ where: { providerId } });

        if (user) {
            return user;
        }

        const newUser = new User();
        newUser.email = email;

        return await this.userRepository.save(newUser);
    }

    getToken(payload: JwtPayload) {
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '2h',
            secret: process.env.JWT_SECRET,
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_SECRET,
        });

        return { accessToken, refreshToken };
    }

    // 이떄 db에 저장하기

    // 파라미터로 로그인해서 나온 액세스 토큰 넣어서 사용자 정보 확인하기.
    // https://hou27.tistory.com/entry/카카오로-로그인하기-JWT-토큰-발급-OAuth // 이거 참고함.
    // https://velog.io/@dldmswjd322/Nest-카카오-로그인-API-사용하기
    // https://velog.io/@nara7875/Node.js-kakao-login-api-가져오기 // 이것도 내일 한번 보기.
    // 토큰으로 사용자 정보 뽑아내기. 카카오
    async getUserInfoWithTokenKakao(token: string): Promise<string> {
        const user_info = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        
        console.log('user_info.data is', user_info.data.kakao_account);


        // console.log('nickname is', user_info.data.properties.nickname);
        // console.log('profile_image is', user_info.data.properties.nickname);
        // console.log('user_info.data is', user_info.data.properties.nickname);

        const email = user_info.data.kakao_account.email

        const user = await this.userRepository.findOne({ email });

        if (!user) { // 안담겨있다 -> 신규 유저
            console.log(`해당 이메일의 유저가 존재하지 않습니다.`);
            this.userRepository.createUser(user_info.data.kakao_account.email, user_info.data.kakao_account.profile.thumbnail_image_url, user_info.data.kakao_account.email.split('@')[0]);
            return `해당 이메일의 유저가 존재하지 않습니다.`;
        } else { // 이미 있는 경우
            console.log(`사용자 이메일이 ${user_info.data.kakao_account.email}인 유저입니다.`);
            return user_info.data.kakao_account.email;
        }

        // if (this.userRepository.find({ where: { email: user_info.data.kakao_account.email } })) {
        //     console.log(`사용자 이메일이 ${user_info.data.kakao_account.email}인 유저입니다.`);
        //     return user_info.data.kakao_account.email;
        // } else { // 사용자 없는 경우 -> 첫 로그인
        //     console.log(`해당 이메일의 유저가 존재하지 않습니다.`);
        //     this.userRepository.createUser(user_info.data.kakao_account.email, user_info.data.kakao_account.profile.thumbnail_image_url, user_info.data.kakao_account.email.split('@')[0]);
        //     return `해당 이메일의 유저가 존재하지 않습니다.`;
        // }
    }

    // 토큰으로 사용자 정보 뽑아내기. 구글
    async getUserInfoWithTokenGoogle(token: string) {
        const user_info = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        console.log('(구글) 액세스 토큰을 이용해 가져온 사용자 이메일: ', user_info.data.email);
    }

    // 토큰으로 사용자 정보 뽑아내기. 네이버
    async getUserInfoWithTokenNaver(token: string) {
        const user_info = await axios.get(`https://openapi.naver.com/v1/nid/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })

        console.log('(네이버) 액세스 토큰을 이용해 가져온 사용자 이메일: ', user_info.data.response.email);
    }

    // 토큰으로 로그아웃 하기. 카카오
    // 참고 링크: https://12ahn22.tistory.com/33
    async kakaoLogout(token: string) {
        const user_info = await axios.get(`https://kapi.kakao.com/v1/user/unlink`, { // logout
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        console.log('카카오 로그 아웃 완료');
        return '로그아웃 완료';
    }

    
    async kakaoLogin(req) {
        if (!req.user) {
            return 'No user from Kakao'
        }

        const email = req.user.email;
        const profileImg = req.user.picture;
        const nickname = email.split('@')[0];
        console.log('(서비스) nickname is', nickname);

        const user = await this.userRepository.findOne({ email }); // 디비에서 email을 가진 사람 찾는 코드


        if (!user) { // 안담겨있다 -> 신규 유저
            //this.userRepository.createUser(email, profileImg, nickname);
        } else { // 이미 있는 경우
            console.log('이미 있음');
        }

        console.log("서비스에서 찍은 request입니다.(카카오)");


        // return req.user.accessToken;
        return {
            message: 'User Info from Kakao',
            user: req.user
        }
    }

    async getUsersInfo(userId: number) {
        return await this.userRepository.findOne(userId);
    }

    // // 프로필 수정 (이메일)
    // async editUser(email: string, nickname: string, @UploadedFiles() files: Express.Multer.File[], location: string) {

    //     try {
    //         const uploadFiles = [];
    //         for (const element of files) {
    //             const file = new S3();
    //             file.originalName = element.originalname;
    //             uploadFiles.push(file);
    //         }

    //         await this.s3Repository.save(uploadFiles);
    //         const url = (location);

    //         return this.userRepository.editUser(email, nickname, url)
    //     } catch (err) {
    //         throw new BadRequestException(err.message);
    //     }
    // }

    // 프로필 수정 (토큰으로, userId)
    async editUser(userId: number, nickname: string, @UploadedFiles() files: Express.Multer.File[], location: string) {

        try {
            const uploadFiles = [];
            for (const element of files) {
                const file = new S3();
                file.originalName = element.originalname;
                uploadFiles.push(file);
            }

            await this.s3Repository.save(uploadFiles);
            const url = (location);

            return this.userRepository.editUser(userId, nickname, url)
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    // 내가 찜한 술 목록
    async myLikeAlcoholList(id: number) {

        const query = this.likeRepository.createQueryBuilder('like'); // 쿼리 사용

        query.where('like.userId = :userId', { userId: id });

        const likes = await query.getMany();

        let alcoholList = [];
        for (const key in likes) {
            let alcoholId = likes[key].alcoholId;
            let alcohol = await this.alcoholRepository.findOne(alcoholId);
            alcoholList.push(alcohol);
        }

        return alcoholList;
    }

    // =============================2

    async getUserInfo2(access_token: string) {
        //console.log(access_token);
        return await fetch('https://kapi.kakao.com/v2/user/me',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json());
    }

    async getToken2(token: string, client_id: string, redirect_uri: string): Promise<any> {
        return await fetch("https://kauth.kakao.com/oauth/token", {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: qs.stringify({
                grant_type: 'authorization_code',
                client_id: client_id,
                redirect_uri: redirect_uri,
                code: token
            })
        }).then(res => res.json());
    }

    async logoutToken2(access_token: string) {
        const respone = await fetch("https://kapi.kakao.com/v1/user/unlink",
            {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json());
        console.log(respone);
    }
}