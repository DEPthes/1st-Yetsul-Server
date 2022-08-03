import { BadRequestException, Injectable, Req, UploadedFiles } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { S3 } from 'src/Entity/s3.entity';
import { S3Repository } from 'src/Repository/s3.repository';
import { UserRepository } from './user.repository';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository)
        @InjectRepository(AlcoholRepository)
        @InjectRepository(S3Repository)
        private userRepository: UserRepository,
        private alcoholRepository: AlcoholRepository,
        private s3Repository: S3Repository
    ) { }

    // // 찜하기
    // async likeAlcohol(userId: number, alcoholId: number) {
    //     const user = await this.userRepository.findOne(userId);
    //     await this.userRepository.save(user);
    //     const alcohol = await this.alcoholRepository.findOne(alcoholId);
    //     await this.alcoholRepository.save(alcohol);

    //     // if (user.alcohols === undefined)
    //     if (!user.alcohols) {
    //         console.log('ee');
    //         user.alcohols = []; // 아무것도 없을 시 undefinded일 때 push하면 오류 ??
    //     }

    //     user.alcohols.push(alcohol);
    //     console.log('user = ', user);
    //     console.log('user.alcohols = ', user.alcohols.length);

    //     return await this.userRepository.save(user);
    // }

    async googleLogin(req) {
        if (!req.user) {
            return 'No user from Google'
        }

        const email = req.user.email;
        const profileImg = req.user.picture;
        const nickname = email.split('@')[0];


        const user = await this.userRepository.findOne({ email });

        if (!user) {
            this.userRepository.createUser(email, profileImg, nickname);
        }

        return {
            message: 'User Info from Google',
            user: req.user
        }
    }

    async naverLogin(req) {
        if (!req.user) {
            return 'No user from Naver'
        }

        const email = req.user.email;
        const profileImg = req.user.picture;
        const nickname = email.split('@')[0];

        const user = await this.userRepository.findOne({ email });

        if (!user) {
            this.userRepository.createUser(email, profileImg, nickname);
        }

        return {
            message: 'User Info from Naver',
            user: req.user
        }
    }

    async kakaoLogin(req) { 
        if (!req.user) {
            return 'No user from Kakao'
        }

        const email = req.user.email;
        const profileImg = req.user.picture;
        const nickname = email.split('@')[0];
        console.log('nickname is ', nickname);

        const user = await this.userRepository.findOne({ email });

        if (!user) {
            this.userRepository.createUser(email, profileImg, nickname);
        }
        
        console.log("서비스에서 찍은 request입니다. ");
        // console.log(req);
        // console.log(req.user.accessToken);

        return req.user.accessToken;
    }

    async getUsersInfo() {
        return await this.userRepository.find();
    }

    async editUser(id: number, nickname: string, @UploadedFiles() files: Express.Multer.File[], location: string) {

        try {
            const uploadFiles = [];
            for (const element of files) {
                const file = new S3();
                file.originalName = element.originalname;
                uploadFiles.push(file);
            }

            await this.s3Repository.save(uploadFiles);
            const url = (location);

            return this.userRepository.editUser(id, nickname, url)
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }
}