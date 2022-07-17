import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) { }

    async googleLogin(req) {
        if (!req.user) {
            return 'No user from Google'
        }

        const email = req.user.email;
        const profileImg = req.user.picture;


        const user = await this.userRepository.findOne({ email });

        if (!user) {
            this.userRepository.createUser(email, profileImg);
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


        const user = await this.userRepository.findOne({ email });

        if (!user) {
            this.userRepository.createUser(email, profileImg);
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


        const user = await this.userRepository.findOne({ email });

        if (!user) {
            this.userRepository.createUser(email, profileImg);
        }

        return {
            message: 'User Info from Kakao',
            user: req.user
        }
    }
}
