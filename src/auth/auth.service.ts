import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    googleLogin(req) {
        if (!req.user) {
            return 'No user from Google'
        }
        return {
            message: 'User Info from Google',
            user: req.user
        }
    }

    naverLogin(req) {
        if (!req.user) {
            return 'No user from Naver'
        }
        return {
            message: 'User Info from Naver',
            user: req.user
        }
    }

    kakaoLogin(req) {
        if (!req.user) {
            return 'No user from Kakao'
        }
        return {
            message: 'User Info from Kakao',
            user: req.user
        }
    }
}
