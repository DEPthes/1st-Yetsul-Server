import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-naver-v2";

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
    constructor() {
        super({
            clientID: process.env.naver_clientID,
            clientSecret: process.env.naver_clientSecret,
            callbackURL: process.env.naver_callbackURL,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done): Promise<any> {
        //const {name, emails, photos} = profile;
        const user = {
            email: profile.email,
            nick: profile.name,
            snsId: profile.id,
            accessToken,
        }
        done(null, user); // 첫번째 인수는 에러 발생 시 사용, 두번째는 저장할 데이터
    }
}